class CorsMiddleware {
	handle = (req, res, next) => {
		// Allowed Origins list (only these domains can access your API)
		const allowedOrigins = [
			'http://localhost:3000', 
			'https://app.example.com', 
			'https://example.com', 
			'https://myapp.com',
		];

		// Get the origin of the incoming request
		const origin = req?.headers?.origin;

		// If the request's origin is in the allowed list, set CORS header
		if (allowedOrigins.includes(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}

		// Allow these HTTP methods from the client
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

		/**
		 * Allow these headers(Content-Type, Authorization) from the client
		 * 
		 * Content-Type (send the json data)
		 * Authorization (send the token data)
		 */
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
	}
}

const middleware = new CorsMiddleware();

module.exports = middleware.handle;