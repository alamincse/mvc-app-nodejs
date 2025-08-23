const Log = require('../../system/security/Logger');

class RequestLogger {
	handle = async (req, res, next) => {
    	// Get client IP safely (proxy aware)
		const ip = (req.headers && req.headers['x-forwarded-for']?.split(',').shift()) || // proxy IP
					req.socket?.remoteAddress || 										 // modern Node
					req.connection?.remoteAddress || 									// older Node
					'unknown';	

		const start = Date.now();

    	const { method, url } = req;

    	// Hook into response finish to log status & time
    	const originalEnd = res.end;

	    res.end = function (...args) {
      		const duration = Date.now() - start;

	      	const status = res.statusCode;

	      	let level = "INFO";
	      	
	      	if (status >= 500) {
	      		level = "ERROR";	
	      	} else if (status >= 400) {
	      		level = "WARN";
	      	}

	      	Log._write(
		        level,
		        `IP: ${ip}, Method: ${method}, URL: ${url}, Status: ${status}, Time: ${duration}ms`
	      	);

	      	originalEnd.apply(res, args);
	    };

	    // call next middleware or controller
	    next();
  	}
}

const middleware = new RequestLogger();

module.exports = middleware.handle;