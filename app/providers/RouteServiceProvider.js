const Route = require('../../system/Route');
const webRoutes = require('../../routes/web');
const apiRoutes = require('../../routes/api');
const RateLimiter = require('../middleware/RateLimiter');

class RouteServiceProvider {
	// check routes object is empty or not!
	isEmptyObject(routeObject) {
		return routeObject && Object.keys(routeObject).length === 0 && routeObject.constructor === Object;
	}

	/**
	 * Load all application routes (web + api) into a single route instance
	 * with proper prefix handling and apply global middlewares like RateLimiter.
	 */
	loadRoutes() {
		const Router = new Route();

		// RateLimiter configuration: 60 requests per 1 minute
		const limit = 60;
		const time = 60 * 1000; // 1 minute in milliseconds
		const globalRateLimiter = new RateLimiter(limit, time);

		// Apply global RateLimiter middleware to all routes
		[webRoutes, apiRoutes].forEach(routeGroup => {
      		routeGroup.routes.forEach(route => {
	        	route.middlewares = [globalRateLimiter.handle, ...(route.middlewares || [])];
	      	});
	    });

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
