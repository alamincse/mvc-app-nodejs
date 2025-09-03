const url = require('url');

class RouteLogger {
	handle = (req, res, next) => {
		try {
			// Get client IP safely (proxy aware)
			const ip = (req.headers && req.headers['x-forwarded-for']?.split(',').shift()) || // proxy IP
						req.socket?.remoteAddress || 										 // modern Node
						req.connection?.remoteAddress || 									// older Node
						'unknown';		

			const now = new Date().toLocaleString();
	        const method = req.method;
	        const path = url?.parse(req?.url)?.pathname;
	        
	        console.log(`[${now}] ${ip} -> ${method} ${path}`);
	        
	        if (next) next(); // call next middleware/controller
		} catch (err) {
			res.writeHead(500, { 'Content-Type': 'application/json' });

			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	}
}

const middleware = new RouteLogger();

module.exports = middleware.handle;