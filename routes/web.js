const Route = require('../system/Route');
const HomeController = require('../app/controllers/HomeController');

Route.get('/home', HomeController.index);

module.exports = Route;