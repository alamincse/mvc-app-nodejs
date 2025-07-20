const Model = require('../../system/Model');

class User extends Model {
	constructor() {
		super('users', [
			'name',
			'email',
			'password',
		]);
	}
}

module.exports = new User();