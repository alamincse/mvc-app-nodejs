const url = require('url');

class RouteLogger {
	static handle(req, res, next) {
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
	}
}

module.exports = RouteLogger;