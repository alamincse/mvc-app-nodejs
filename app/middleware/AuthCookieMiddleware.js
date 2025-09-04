const { verifyToken } =  require('@helpers/utilities');

class AuthCookieMiddleware {
	handle = async (req, res, next) => {
		try {
		    const cookies = parseCookies(req.headers.cookie ?? '');

		    const token = cookies['session_token'];
		    const validToken = validateToken(token);
			const tokenData = await verifyToken(token);

			if (token && validToken && tokenData) {
		     	next();
			} else {
		      	res.writeHead(302, { Location: '/home' });
		     	res.end();
		    }
		} catch (err) {
			Log.error(err.stack ?? err.message);
			
			res.writeHead(500, { 'Content-Type': 'application/json' });

			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
  	}
}

const middleware = new AuthCookieMiddleware();

module.exports = middleware.handle;