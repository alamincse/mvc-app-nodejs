class Route {
	static routes = [];

	static register(method, path, handler) {
		this.routes.push({ 
			method: method.toUpperCase(), 
			path, 
			handler,
		});
	}

	static get(path, handler) {
		this.register('GET', path, handler);
	}

	static post(path, handler) {
		this.register('POST', path, handler);
	}

	static put(path, handler) {
		this.register('PUT', path, handler);
	}

	static delete(path, handler) {
		this.register('DELETE', path, handler);
	}

	static resolve(req, res) {
		const reqMethod = req.method;
		const reqUrl = req.url.split('?')[0];

		const matchedRoute = this.routes.find(route =>
			route.method === reqMethod && route.path === reqUrl
		);

		if (matchedRoute) {
			// res.setHeader('Content-Type', 'application/json');
			// here controller methods are called!(handler = HomeController.index)
			// console.log(matchedRoute);
			matchedRoute.handler(req, res);
		} else {
			res.writeHead(404, { 
				'Content-Type': 'application/json' 
			});
			res.end(JSON.stringify({ 
				message: 'Route Not Found' 
			}));
		}
	}
}

/**
 * Note: If methods are not static then we need to create object then exports!
 * like: const route = new Route; module.exports = routes;
*/
module.exports = Route;