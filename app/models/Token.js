const Model = require('@engine/Model');

class Token extends Model {
	constructor() {
		super('tokens', [
			'user_id',
			'token',
			'expires_at',
		]);
	}
}

module.exports = new Token();