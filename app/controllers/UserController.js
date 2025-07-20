const response = require('../../helpers/response');
const { hash } = require('../../helpers/utilities');
const User = require('../models/User');

class UserController {
	async index(req, res) {
		try {
			const result = await User.all();

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
			const user = {
				name: 'Alamin',
				email: 'alamin_php02@example.com',
				password: hash('secret'), 
			};

			const result = await User.create(user);

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