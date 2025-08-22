const Route = require('../../system/Route');
const webRoutes = require('../../routes/web');
const apiRoutes = require('../../routes/api');
const RateLimiter = require('../middleware/RateLimiter');
const RouteLogger = require('../middleware/RouteLogger');
const CsrfMiddleware = require('../middleware/CsrfMiddleware');

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
            RouteLogger, // Log route info
            this.configureRateLimiting(),  // Apply rate limiting
        ];

        // Apply CSRF middleware only to web routes
        if (routeType === 'web') {
            middlewares.push(CsrfMiddleware.bind(CsrfMiddleware)); // Apply CSRFMiddleware <-- bind handle method
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
	 * Load all application routes (web + api) into a single route instance
	 * with proper prefix handling and apply global middlewares like RateLimiter, RouteLogger.
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
			Router.mergeWithPrefix(apiRoutes, '/api');
		}

		// console.log(Router) 
		// return all Routes(web + api)

		// Return the combined router instance
		return Router; 
	}
}

const routeServiceProvider = new RouteServiceProvider();

module.exports = routeServiceProvider.loadRoutes();
