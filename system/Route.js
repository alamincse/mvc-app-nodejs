const url = require('url');
const { IncomingForm } = require('formidable');
const { StringDecoder } = require('string_decoder');
const { parseJSON, normalizeFormData } = require('../helpers/utilities');

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

	// Handle all incoming request
	static resolve(req, res) {
		const reqMethod = req.method;
		const reqUrl = req.url.split('?')[0];

		const matchedRoute = this.routes.find(route =>
			route.method === reqMethod && route.path === reqUrl
		);

		if (matchedRoute) {
			// get the url info and parse it
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

			// Multipart/form-data handling
			if (contentType.includes('multipart/form-data')) {
				const form = new IncomingForm({ multiples: true });

				form.parse(req, (err, fields, files) => {
					if (err) {
						res.writeHead(400);

						return res.end('Failed to parse form');
					}

					req.body = normalizeFormData(fields);
					req.files = files;

					return matchedRoute.handler(req, res);
				});

				return;
			}


			// decode striming payload data 
			const decoder = new StringDecoder('utf-8');
			let buffer = '';

			req.on('data', (chunk) => {
				buffer += decoder.write(chunk);
			});

			req.on('end', () => {
				buffer += decoder.end();

				// Parse and attach body data
				if (contentType?.includes('application/json')) { // For raw json data
					req.body = parseJSON(buffer);
				} else if (contentType.includes('application/x-www-form-urlencoded')) {
					const params = new URLSearchParams(buffer);

					req.body = Object.fromEntries(params.entries());
				}

				// here controller methods are called!(handler = HomeController.index)
				// console.log(matchedRoute);
				matchedRoute.handler(req, res);
			});
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