const response = require('../../helpers/response');
const { hash } = require('../../helpers/utilities');
const User = require('../models/User');

class UserController {
	async index(req, res) {
		try {
			const currentPage = req.queryStringObject.currentPage;

			const result = await User.paginate(currentPage);

			return response.json(res, {
				success: true,
				message: 'Success',
				data: result,
			});
		} catch (err) {
			console.log(err);

			return response.error(res, 'Failed');
		}
	}

	async store(req, res) {
		try {
			const data = req.body;

			if (data.password) {
				data.password = hash(data.password);
			}

			const result = await User.create(data);

			console.log('User created');

			// Return success response
			return response.json(res, {
				success: true,
				message: 'User created successfully',
				data: result,
			});
		} catch (err) {
			console.log(err);

			return response.error(res, 'Failed to create user');
		}
	}
}

module.exports = new UserController();