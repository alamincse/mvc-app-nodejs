const response = {
	json(res, data, status = 200) {
		res.writeHead(status, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(data));
	},

	success(res, message = 'Success') {
		this.json(res, { success: true, message });
	},

	error(res, message = 'Something went wrong', status = 500) {
		this.json(res, { success: false, message }, status);
	},

	notFound(res, message = 'Not Found') {
		this.error(res, message, 404);
	}
};

module.exports = response;
