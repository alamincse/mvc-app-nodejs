class RateLimiter {
	constructor(limit = 100, windowMs = 60 * 1000) {
		this.limit = limit; 					 // maximum allowed requests per IP
		this.windowMs = windowMs; 				// time window in milliseconds
		this.rateLimitMap = {}; 			   // store request timestamps per IP
		this.handle = this.handle.bind(this); // bind this to handle method
	}

	/**
	 * Middleware handler
   	 * @param {object} req - HTTP request object
   	 * @param {object} res - HTTP response object
   	 * @param {function} next - Next middleware function
   	 */
	handle(req, res, next) {
		try {
			// Get client IP safely (proxy aware)
			const ip = (req.headers && req.headers['x-forwarded-for']?.split(',').shift()) || // proxy IP
						req.socket?.remoteAddress || 										 // modern Node
						req.connection?.remoteAddress || 									// older Node
						'unknown';														   // fallback

			const now = Date.now(); // current timestamp

			// Initialize IP array if not exist
	    	if (! this.rateLimitMap[ip]) this.rateLimitMap[ip] = [];

	    	// Remove old requests outside the window
	    	this.rateLimitMap[ip] = this.rateLimitMap[ip].filter(ts => now - ts < this.windowMs);

	    	// Check if limit exceeded
	    	if (this.rateLimitMap[ip].length >= this.limit) {
	      		const message = 'Too many requests. Please try again later.';

	      		console.log('Error: ' +message);

	      		res.writeHead(429, { 
					'Content-Type': 'application/json' 
				});

	      		res.end(JSON.stringify({ message }));
	      		
	      		// stop further processing
	      		return; 
	    	}

	    	// Log current request timestamp
	    	this.rateLimitMap[ip].push(now);

	    	// Proceed to next middleware or route handler
	    	next();
		} catch (err) {
			Log.error(err.stack ?? err.message);
			
			res.writeHead(500, { 'Content-Type': 'application/json' });

			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	}
}

module.exports = RateLimiter;