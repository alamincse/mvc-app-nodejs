const Route = require('../../system/Route');
const webRoutes = require('../../routes/web');
const apiRoutes = require('../../routes/api');
const RateLimiter = require('../middleware/RateLimiter');
const RouteLogger = require('../middleware/RouteLogger');

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
     * Configure and return all global middlewares
     * @returns {Array} Array of global middleware functions
     */
    getGlobalMiddlewares() {
        return [
            RouteLogger.handle, // Log route info
            this.configureRateLimiting(),  // Apply rate limiting
        ];
    }

  	/**
     * Apply a list of global middlewares to all routes in given route groups
     */
    applyGlobalMiddlewares() {
    	const middlewares = this.getGlobalMiddlewares();

        [webRoutes, apiRoutes].forEach(routeGroup => {
            if (routeGroup?.routes?.length) {
                routeGroup.routes.forEach(route => {
                    // Prepend global middlewares to each route's existing middlewares
                    route.middlewares = [...middlewares, ...(route.middlewares || [])];
                });
            }
        });
    }


	/**
	 * Load all application routes (web + api) into a single route instance
	 * with proper prefix handling and apply global middlewares like RateLimiter, RouteLogger.
	 */
	loadRoutes() {
		const Router = new Route();

		// Apply global middleware
    	this.applyGlobalMiddlewares();

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
