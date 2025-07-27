const Route = require('../../system/Route');
const webRoutes = require('../../routes/web');
const apiRoutes = require('../../routes/api');


class RouteServiceProvider {
	// check routes object is empty or not!
	isEmptyObject(routeObject) {
		return routeObject && Object.keys(routeObject).length === 0 && routeObject.constructor === Object;
	}

	/**
	 * Load all application routes (web + api) into a single route instance
	 * with proper prefix handling.
	 */
	loadRoutes() {
		const Router = new Route();

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
		return Router; 
	}
}

const routeServiceProvider = new RouteServiceProvider();

module.exports = routeServiceProvider.loadRoutes();
