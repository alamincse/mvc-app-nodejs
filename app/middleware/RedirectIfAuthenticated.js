const { validateToken, verifyToken, parseCookies } =  require('../../helpers/utilities');

class RedirectIfAuthenticated {
	handle = async (req, res, next) => {
		try {
			console.log(req.headers.cookie);
		    const cookies = parseCookies(req.headers.cookie || '');

		    const token = cookies['session_token'];
		    const validToken = validateToken(token);
			const tokenData = await verifyToken(token);

			if (!token && !validToken && !tokenData) {
				// Go back login/register page(user not logged in)
		     	next();
			} else {
				// user already authenticated/logged in
		      	res.writeHead(302, { Location: '/profile' });

        		return res.end();
		    }
		} catch (err) {
			res.writeHead(500, { 'Content-Type': 'application/json' });

			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
  	}
}

const middleware = new RedirectIfAuthenticated();

module.exports = middleware.handle;