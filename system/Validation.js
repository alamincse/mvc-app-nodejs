const db = require('../config/db.js');

class Validation {
	static async validate(data, rules) {
		let errors = {};

		for (let field in rules) {
			const fieldRules = rules[field].split('|');
			const value = data[field];

			for (let rule of fieldRules) {
				if (rule === 'required') {
					if (!value || value.toString().trim() === '') {
						errors[field] = `The ${field} field is required`;
					}
				}

				if (rule.startsWith('min:')) {
					const min = parseInt(rule.split(':')[1]);

					if (value && value.length < min) {
						errors[field] = `The ${field} must be at least ${min} characters`;
					}
				}

				if (rule.startsWith('max:')) {
					const max = parseInt(rule.split(':')[1]);

					if (value && value.length > max) {
						errors[field] = `The ${field} must be less than ${max} characters`;
					}
				}

				if (rule === 'email') {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

					if (value && !emailRegex.test(value)) {
						errors[field] = `The ${field} must be a valid email`;
					}
				}


				if (rule.startsWith('unique:')) {
					const parts = rule.split(':')[1].split(',');

					const table = parts[0]; // users
					const column = parts[1] || field; // email
					const ignoreId = parts[2]; // ID to ignore

					let sql = `SELECT id FROM ${table} WHERE ${column} = ?`;
					let params = [value];

					if (ignoreId) {
						sql += ` AND id != ?`;
						params.push(ignoreId);
					}

					const result = await new Promise((resolve, reject) => {
						db.query(sql, params, (err, rows) => {
							if (err) return reject(err);
							resolve(rows);
						});
					});

					if (result.length > 0) {
						errors[field] = `This ${field} already exists`;
					}
				}

				if (rule === 'numeric') {
			        if (value && isNaN(value)) {
		          		errors[field] = `The ${field} field must be a number.`;
			        }
		      	}

		    	if (rule.startsWith('same:')) {
			        const otherField = rule.split(':')[1];

			        if (value !== data[otherField]) {
			        	errors[field] = `The ${field} must match the ${otherField}.`;
			        }
		      	}
			}
		}

		return {
			passes: Object.keys(errors).length === 0,
			errors
		};
	}
}

module.exports = Validation;