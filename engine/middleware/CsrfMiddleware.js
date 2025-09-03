const Csrf = require('@engine/security/Csrf');

class CsrfMiddleware {
	handle = (req, res, next) => {
    	try {
			const method = req.method?.toUpperCase();

			// Only protect state changing requests
		    if (['POST', 'PUT', 'DELETE'].includes(method)) {
	     		const csrf = new Csrf(req, res);

		      	const token = req.body?.csrfToken || req.query?.csrfToken || req?.headers?.['x-csrf-token'];

	      		if (! csrf.verifyToken(token)) {
	            	res.writeHead(403, { "Content-Type": "application/json" });

	            	console.log('Error: Invalid CSRF token');

		        	return res.end(JSON.stringify({ error: "Invalid CSRF token" }));
		      	}
		    }

		    next();
		} catch (err) {
			res.writeHead(500, { 'Content-Type': 'application/json' });

			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	}
}

const middleware = new CsrfMiddleware();

module.exports = middleware.handle;