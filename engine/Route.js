/**
 * Route class
 * 
 * A lightweight routing system inspired by frameworks like Laravel,
 * designed to handle HTTP requests, parse incoming data (JSON, form-data, URL-encoded),
 * and execute associated handlers with optional middleware support.
 */
const { StringDecoder } = require('string_decoder');
const Middleware = require('@engine/Middleware');
const { IncomingForm } = require('formidable');
const url = require('url');

class Route {
	routes = [];

	/**
	 * Register a new route
	 *
	 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
	 * @param {string} path - Route path (e.g., "/users")
	 * @param {Function} handler - Callback function to handle the request
	 * @param {Array<Function>} [middlewares=[]] - Optional list of middleware functions
	 */
	register(method, path, handler, middlewares = []) {
		this.routes.push({ 
			method: method.toUpperCase(), 
			path, 
			handler,
			middlewares,
		});
	}

	/**
	 * Define a GET route
	 *
	 * @param {string} path 
	 * @param {Function} handler 
	 * @param {Array<Function>} [middlewares=[]] 
	 */
	get(path, handler, middlewares) {
		this.register('GET', path, handler, middlewares);
	}

	/**
	 * Define a POST route
	 *
	 * @param {string} path 
	 * @param {Function} handler 
	 * @param {Array<Function>} [middlewares=[]] 
	 */
	post(path, handler, middlewares) {
		this.register('POST', path, handler, middlewares);
	}

	/**
	 * Define a PUT route
	 *
	 * @param {string} path 
	 * @param {Function} handler 
	 * @param {Array<Function>} [middlewares=[]] 
	 */
	put(path, handler, middlewares) {
		this.register('PUT', path, handler, middlewares);
	}

	/**
	 * Define a DELETE route
	 *
	 * @param {string} path 
	 * @param {Function} handler 
	 * @param {Array<Function>} [middlewares=[]] 
	 */
	delete(path, handler, middlewares) {
		this.register('DELETE', path, handler, middlewares);
	}

	/**
	 * Resolve incoming requests
	 * - Finds a matching route
	 * - Parses query params, headers and body (JSON, URL-encoded, multipart)
	 * - Executes middleware chain before final handler
	 * 
	 * @param {import('http').IncomingMessage} req - Node.js request object
	 * @param {import('http').ServerResponse} res - Node.js response object
	 */
	resolve(req, res) {
		try {
			const reqMethod = req.method;
			const reqUrl = req.url.split('?')[0];

			const matchedRoute = this.routes.find(route =>
				route.method === reqMethod && route.path === reqUrl
			);

			if (matchedRoute) {
				// get the url info and parse it
				// Extract & normalize request info
				const parseUrl = url.parse(req.url, true);
				const path = parseUrl.pathname;
				const trimePath = path.replace(/^\/+|\/+$/g, '');
				const method = req.method.toLowerCase();
				const queryStringObject = parseUrl.query;
				const headersObject = req.headers;

				req.parseUrl = parseUrl;
				req.path = path;
				req.trimePath = trimePath;
				req.queryStringObject = queryStringObject;
				req.headersObject = headersObject;

				const contentType = req.headers['content-type'];

				// check postman api! Multipart/form-data handling
				// Handle multipart/form-data
				if (contentType?.includes('multipart/form-data')) {
					const form = new IncomingForm({ multiples: true });

					form.parse(req, (err, fields, files) => {
						if (err) {
							res.writeHead(400);

							return res.end('Failed to parse form');
						}

						req.body = normalizeFormData(fields);
						req.files = files;

						// check route has applied middleware or not
						// And Apply middleware if exists
						if (matchedRoute.middlewares?.length) {
							Middleware.handle(matchedRoute.middlewares, req, res, matchedRoute.handler);
						} else {
							matchedRoute.handler(req, res);
						}
					});

					return;
				}


				// decode striming payload data 
				// Handle JSON & URL-encoded body
				const decoder = new StringDecoder('utf-8');
				let buffer = '';

				req.on('data', (chunk) => {
					buffer += decoder.write(chunk);
				});

				req.on('end', () => {
					buffer += decoder.end();

					// check postmant api! Parse and attach body data
					if (contentType?.includes('application/json')) { // For raw json data
						req.body = parseJSON(buffer);
					} else if (contentType?.includes('application/x-www-form-urlencoded')) {
						const params = new URLSearchParams(buffer);

						req.body = Object.fromEntries(params.entries());
					}

					// here controller methods are called!(handler = HomeController.index)
					// console.log(matchedRoute);
					// check route has applied middleware or not
					// And Apply middleware if exists
					if (matchedRoute.middlewares?.length) {
						Middleware.handle(matchedRoute.middlewares, req, res, matchedRoute.handler);
					} else {
						matchedRoute.handler(req, res);
					}
				});
			} else {
				Log.error(`Route Not Found: ${reqMethod} ${reqUrl}`);

				res.writeHead(404, { 
					'Content-Type': 'application/json' 
				});
				
				res.end(JSON.stringify({ 
					message: 'Route Not Found' 
				}));
			}
		} catch (err) {
			Log.error(err.stack ?? err.message);
			
			res.writeHead(500, { 'Content-Type': 'application/json' });

			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	}

	/**
	 * Merge routes from another router
	 *
	 * @param {Route} otherRouter 
	 */
	merge(otherRouter) {
		this.routes.push(...otherRouter?.routes);
	}

	/**
	 * Merge routes from another router with prefix
	 *
	 * @param {Route} otherRouter 
	 * @param {string} [prefix=''] 
	 */
	mergeWithPrefix(otherRouter, prefix = '') {
		otherRouter?.routes?.forEach(route => {
			this.routes.push({
				...route,
				path: prefix + route.path,
			});
		});
	}
}

module.exports = Route;