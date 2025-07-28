const response = require('../../../helpers/response');
const { hash } = require('../../../helpers/utilities');
const User = require('../../models/User');

class UserController {
	async index(req, res) {
		try {
			const currentPage = req.queryStringObject.currentPage;

			// const result = await User.paginate(currentPage);
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

	async show(req, res) {
		try {
			const userId = req?.body?.id;

			const user = await User.find(userId);

			if (! user) {
				return response.error(res, 'User not found');
			}

			// password field remove
			delete user.password;

			return response.json(res, {
				success: true,
				message: 'Success',
				data: user,
			});
		} catch (err) {
			console.log(err);

			return response.error(res, 'Failed to create user');
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

	async update(req, res) {
		try {
			const userId = req.body.id;

			const data = {
				name: req.body.name,
				email: req.body.email,
			}

			const user = await User.find(userId);

			if (! user) {
				return response.error(res, 'User not found');
			}

			const result = await User.update(userId, data);

			console.log('User updated');

			return response.json(res, {
				success: true,
				message: 'User updated successfully',
				data: result,
			});
		} catch (err) {
			console.log(err);

			return response.error(res, 'Failed to update user');
		}
	}

	async delete(req, res) {
		try {
			const userId = req?.body?.id;

			const user = await User.find(userId);

			if (! user) {
				return response.error(res, 'User not found');
			}

			// Delete user & user token
			await User.deleteByColumn('id', userId);

		    return response.json(res, {
				success: true,
				message: 'Success',
				data: 'ok',
			});
		} catch (err) {
			console.log(err);

			return response.error(res, 'Failed to delete user');
		}
	}
}

module.exports = new UserController();