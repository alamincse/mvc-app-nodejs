const config = require('@config/app');
const Route = require('@engine/Route');
const webRoutes = require('@routes/web');
const apiRoutes = require('@routes/api');
const RateLimiter = require('@engine/middleware/RateLimiter');
const RouteLogger = require('@engine/middleware/RouteLogger');
const XssProtection = require("@engine/middleware/XssProtection");
const RequestLogger = require('@engine/middleware/RequestLogger');
const CsrfMiddleware = require('@engine/middleware/CsrfMiddleware');
const CorsMiddleware = require('@engine/middleware/CorsMiddleware');
const SecurityHeadersMiddleware = require('@engine/middleware/SecurityHeadersMiddleware');

class RouteServiceProvider {
	/**
     * Check if the given routes object is empty
     * @param {Object} routeObject - The object to check
     * @returns {boolean} True if the object has no keys, false otherwise
     */
	isEmptyObject(routeObject) {
		return routeObject && Object.keys(routeObject).length === 0 && routeObject.constructor === Object;
	}

	/**
   	 * Apply global middlewares like RateLimiter to all routes
	 */
  	configureRateLimiting() {
  		// Configure RateLimiter: allow 60 requests per 1 minute
		const limit = 60;
		const time = 60 * 1000; // 1 minute in milliseconds

		const globalRateLimiter = new RateLimiter(limit, time);

		return globalRateLimiter?.handle;
  	}

  	/**
     * Get global middlewares for a specific route type
     *
     * @param {string} routeType - 'web' or 'api'
     * @returns {Array} Array of middleware functions
     */
    getGlobalMiddlewares(routeType) {
    	// apply for both web & api routes
        const middlewares = [
            RouteLogger, // Log route info for terminal display
            XssProtection, // Apply XSS Protection (Cross-Site Scripting)
            RequestLogger, // Middleware to log HTTP requests and errors to daily log files (like Laravel)
            // SecurityHeadersMiddleware, // Apply Security Headers
            this.configureRateLimiting(),  // Apply rate limiting
        ];

        // Apply CSRF middleware only to web routes
        if (routeType === 'web') {
            middlewares.push(CsrfMiddleware.bind(CsrfMiddleware)); // Apply CSRFMiddleware <-- bind handle method
        }

        if (routeType === 'api') {
        	middlewares.push(CorsMiddleware); // Apply CORS middleware only to API routes
        }

        return middlewares;
    }

  	 /**
      * Apply global middlewares to a route group
      *
      * @param {Object} routeGroup - The route group object
      * @param {string} routeType - 'web' or 'api'
      */
    applyGlobalMiddlewares(routeGroup, routeType) {
    	const middlewares = this.getGlobalMiddlewares(routeType);

        if (routeGroup?.routes?.length) {
            routeGroup.routes.forEach(route => {
                // Prepend global middlewares to each route's existing middlewares
                route.middlewares = [...middlewares, ...(route.middlewares || [])];
            });
        }
    }


   /**
    * Load all application routes (both web and API) into a single Route instance.
    *
    * This method performs the following tasks:
    * 1. Creates a new Route instance to hold all routes.
    * 2. Applies global middlewares separately for web and API routes, such as:
    *    - RateLimiter
    *    - RouteLogger
    * 3. Merges web routes directly into the router without any prefix.
    * 4. Merges API routes into the router with a configurable prefix
    *    (default '/api', can be overridden via config.apiPrefix).
    * 5. Returns the combined Route instance containing both web and API routes.
    *
    * @returns {Route} A Route instance containing all registered web and API routes.
    */
	loadRoutes() {
		const Router = new Route();

    	// Apply global middlewares separately for web and api
        this.applyGlobalMiddlewares(webRoutes, 'web');
        this.applyGlobalMiddlewares(apiRoutes, 'api');

		// Merge web routes as is (no prefix)
		if (! this.isEmptyObject(webRoutes)) {
			Router.merge(webRoutes);
		} 

		// Merge API routes with '/api' prefix
		if (! this.isEmptyObject(apiRoutes)) {
      Router.mergeWithPrefix(apiRoutes, config.apiPrefix);
		}

		// console.log(Router) 
		// return all Routes(web + api)

		// Return the combined router instance
		return Router; 
	}
}

const routeServiceProvider = new RouteServiceProvider();

module.exports = routeServiceProvider.loadRoutes();