const response = {
	json(res, data = {}, status = 200) {
		res.writeHead(status, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(data));
	},

	success(res, data = {}, message = 'Success', status = 200) {
		this.json(res, {
			success: true,
			message,
			data
		}, status);
	},

	error(res, message = 'Something went wrong', errors = null, status = 500) {
		const payload = {
			success: false,
			message,
		};

		if (errors) {
			payload.errors = errors; // For validation or other details
		}

		this.json(res, payload, status);
	},

	unauthorized(res, message = 'Unauthorized') {
		this.error(res, message, null, 401);
	},

	notFound(res, message = 'Not Found') {
		this.error(res, message, null, 404);
	},

	validationError(res, errors, message = 'Validation Failed') {
		this.error(res, message, errors, 422);
	}
};

module.exports = response;
