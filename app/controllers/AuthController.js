const { hash, createRandomString } = require('../../helpers/utilities');
const response = require('../../helpers/response');
const Token = require('../models/Token');
const User = require('../models/User');

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

			const tokenId = createRandomString(40);
			const now = new Date();
			const bdOffset = 6 * 60 * 60 * 1000; // +6 min
			const plusOneHour = 1 * 60 * 60 * 1000;
  			const expires = new Date(now.getTime() + bdOffset + plusOneHour); // 1 hour

  			const token = await Token.create({
							user_id: user?.id,
							token: tokenId,
							expires_at: expires
						});

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
		return response.json(res, {
			success: true,
			message: 'Success',
			data: '',
		});
	}
}

module.exports = new AuthController();