const homeController = require('../controllers/homeController');

const routes = {
	home: homeController.index,
	about: homeController.about,
};

module.exports = routes;
