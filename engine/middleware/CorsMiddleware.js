const cors = require('@config/cors');

class CorsMiddleware {
	handle = (req, res, next) => {
		try {
			// Get the origin of the incoming request
			const origin = req?.headers?.origin;

			// If the request's origin is in the allowed list, set CORS header
			if (cors.allowedOrigins.includes(origin)) {
				res.setHeader('Access-Control-Allow-Origin', origin);
			}

			// Allow these HTTP methods from the client
			res.setHeader('Access-Control-Allow-Methods', cors.allowedMethods.join(', '));

			/**
			 * Allow these headers(Content-Type, Authorization) from the client
			 * 
			 * Content-Type (send the json data)
			 * Authorization (send the token data)
			 */
			res.setHeader('Access-Control-Allow-Headers', cors.allowedHeaders.join(', '));

			/**
			 * OPTIONS preflight request handle
			 * Handle preflight request (browser sends an OPTIONS request before real(GET, POST, PUT, DELETE) request)
			 * If the server replies with 200 OK, then the browser proceeds to send the actual(GET, POST, PUT, DELETE) request. 
			 */
			if (req.method === 'OPTIONS') {
				res.writeHead(200); // Respond OK

				res.end(); // End the response immediately

				return; // Stop further execution
			}

			// Continue to the next middleware or controller
			next();
		} catch (err) {
			Log.error(err.stack ?? err.message);
			
			res.writeHead(500, { 'Content-Type': 'application/json' });

			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	}
}

const middleware = new CorsMiddleware();

module.exports = middleware.handle;