const Sanitizer = require('../../system/security/Sanitizer');

class XssProtection {
	handle = (req, res, next) => {
		try {
			// Sanitize request body
			if (req?.body) {
				req.body = Sanitizer.clean(req.body);
			}

			// Sanitize query params
			if (req?.query) {
				req.query = Sanitizer.clean(req.query);
			}

			// Sanitize route params
			if (req?.params) {
				req.params = Sanitizer.clean(req.params);
			}

			// Next middleware
			next();
		} catch (err) {
			res.writeHead(500, { 'Content-Type': 'application/json' });

			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	}
}

const middleware = new XssProtection();

module.exports = middleware.handle;