const { hash, createRandomString, parseCookies, toBDTime, getBearerToken, validateToken, verifyToken } = require('../../../helpers/utilities');
const response = require('../../../helpers/response');
const Token = require('../../models/Token');
const User = require('../../models/User');

class AuthController {
	async create(req, res) {
		try {
			const data = req.body;
			const email = data.email;
			const password = data.password;
			const hashPassword = hash(password);

			const user = await User.andWhere({
							email: email,
							password: hashPassword
						});

			if (! user) {
				dd('User not found!');

				return response.error(res, 'Failed');
			}

			const tokenId = createRandomString(40);
			const now = new Date();
			
			// get BD time
			const bdTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));

			// 1 hour extra
			const bdExpires = new Date(bdTime.getTime() + 1 * 60 * 60 * 1000);

			const expires = bdExpires.toLocaleString('sv-SE', {
								timeZone: 'Asia/Dhaka',
								hour12: false
							}).replace(' ', 'T');


  			const token = await Token.create({
							user_id: user?.id,
							token: tokenId,
							expires_at: expires
						});

  			token.created_at = toBDTime(token.created_at);
  			token.updated_at = toBDTime(token.updated_at);
  			token.expires_at = toBDTime(token.expires_at);

  			const expiresAt = new Date(token.expires_at);
  			const diffMs = expiresAt.getTime() - now.getTime(); // milliseconds diff
			const diffSeconds = Math.floor(diffMs / 1000); // seconds

			token.expired_at = diffSeconds;

			return response.json(res, {
				success: true,
				message: 'Success',
				data: token,
			});
		} catch (err) {
			console.log(err);

			return response.error(res, 'Failed');
		}
	}

	async logout(req, res) {
		try {
		  	const token = getBearerToken(req.headers);

		  	const validToken = validateToken(token);
			const tokenData = await verifyToken(token);

		  	if (! token && !validToken && !tokenData) {
				return response.error(res, 'Invalid token');
			}

		  	await Token.deleteByColumn('token', token);

		    return response.json(res, {
				success: true,
				message: 'Success',
				data: 'ok',
			});
		} catch (error) {
		    console.error('Logout error:', error);

		   return response.error(res, 'Failed');
		}
	}
}

module.exports = new AuthController();