const { validateToken, verifyToken } =  require('../../helpers/utilities');

class AuthMiddleware {
	handle = async (req, res, next) => {
		try {
			const authHeader = req.headers['authorization'];

			if (! authHeader) {
				return this.unauthorized(res, 'Authorization header missing');
			}

			const [type, token] = authHeader.split(' ');

			const validToken = validateToken(token);
			const tokenData = await verifyToken(token);

			if (type !== 'Bearer' || !token) {
				return this.unauthorized(res, 'Invalid Authorization format');
			} else if (! validToken) {
				return this.unauthorized(res, 'Invalid Bearer Token');
			} else if (! tokenData) {
				return this.unauthorized(res, 'Authentication failed or token expired');
			} else {
				// assign logged in user id & token
				req.user = {
					id: tokenData.user_id,
					token: tokenData.token,
				};

				// Auth passed → go to controller
				next();
			}
		} catch (err) {
			res.writeHead(500, { 'Content-Type': 'application/json' });

			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	}

	unauthorized(res, message) {
		res.writeHead(401, { 
			'Content-Type': 'application/json' 
		});

		res.end(JSON.stringify({ message }));
	}
}

const middleware = new AuthMiddleware();

module.exports = middleware.handle;