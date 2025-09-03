const MailService = require('@engine/services/MailService');
const Validation = require('@engine/Validation');
const { hash } = require('@helpers/utilities');
const response = require('@helpers/response');
const User = require('@app/models/User');

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
				return response.error(res, 'Failed', {
					id: 'User does not found'
				});
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
			const { name, email, password } = req.body;

			const { passes, errors } = await Validation.validate(
				{ name, email, password },
				{
					name: 'required|min:3',
					email: 'required|email|unique:users,email',
					password: 'required|min:3'
				}
			);

			if (! passes) {
				return response.validationError(res, errors);
			}

			const data = {
				name: name,
				email: email,
				password: hash(password),
			};

			const result = await User.create(data);

			console.log('User created');

			// Send a welcome email to a newly registered user!
			await MailService.sendMail({
		        to: email,
		        subject: 'New Account Registered',
		        text: 'Hello from MVC APP Node.js!',
		        html: `<b>Hello ${name}, Thank you for your Registration!</b>`
		    });

			return response.json(res, {
				success: true,
				message: 'User created successfully',
				data: result,
			});
		} catch (err) {
			console.log(err);

			return response.error(res, 'Failed', {
					message: 'User does not created '
				});
		}
	}

	async update(req, res) {
		try {
			const { id, name, email } = req.body;

			const { passes, errors } = await Validation.validate(
				{ id, name, email },
				{
					id: 'required',
					name: 'required|min:3',
					email: `required|email|unique:users,email,${id}`,
				}
			);

			if (! passes) {
				return response.validationError(res, errors);
			}

			const userId = id;

			const data = {
				name: name,
				email: email,
			}

			const user = await User.find(userId);

			if (! user) {
				return response.error(res, 'Failed', {
					id: 'User does not found'
				});
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

			return response.error(res, 'Failed', {
					message: 'User does not updated '
				});
		}
	}

	async delete(req, res) {
		try {
			const userId = req?.body?.id;

			const user = await User.find(userId);

			if (! user) {
				return response.error(res, 'Failed', {
					id: 'User does not found'
				});
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

			return response.error(res, 'Failed', {
					message: 'User does not deleted '
				});
		}
	}
}

module.exports = new UserController();