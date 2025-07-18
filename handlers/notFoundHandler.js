const notFoundHandler = (request, callback) => {
	callback(404, { 
		error: 'Route not found' 
	});
};

module.exports = { notFoundHandler };
