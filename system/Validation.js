class Validation {
	static validate(data, rules) {
		let errors = {};

		for (let field in rules) {
			const fieldRules = rules[field].split('|');
			const value = data[field];

			for (let rule of fieldRules) {
				if (rule === 'required') {
					if (!value || value.toString().trim() === '') {
						errors[field] = `${field} field is required`;
					}
				}

				if (rule.startsWith('min:')) {
					const min = parseInt(rule.split(':')[1]);

					if (value && value.length < min) {
						errors[field] = `${field} must be at least ${min} characters`;
					}
				}

				if (rule.startsWith('max:')) {
					const max = parseInt(rule.split(':')[1]);

					if (value && value.length > max) {
						errors[field] = `${field} must be less than ${max} characters`;
					}
				}

				if (rule === 'email') {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

					if (value && !emailRegex.test(value)) {
						errors[field] = `${field} must be a valid email`;
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