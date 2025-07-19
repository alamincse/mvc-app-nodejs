const Route = require('../../system/Route');
const HomeController = require('../controllers/HomeController');

Route.get('/home', HomeController.index);

module.exports = Route;