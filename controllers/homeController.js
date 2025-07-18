const homeController = {};

homeController.index = (requestProperties, callback) => {
	callback(200, { message: 'Welcome to Home Page' });
};

homeController.about = (requestProperties, callback) => {
	callback(200, { message: 'About Page' });
};

module.exports = homeController;
