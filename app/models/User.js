const db = require('../../config/db');

class User {
	table = 'users';

	create(data) {
		return new Promise((resolve, reject) => {
			const sql = `INSERT INTO ${this.table} (name, email, password) VALUES (?, ?, ?)`;
			const values = [data.name, data.email, data.password];

			db.query(sql, values, (error, result) => {
				if (error) return reject(error);

				resolve(result);
			});
		});
	}
}

module.exports = new User();