const Route = require('../system/Route');
const HomeController = require('../app/controllers/HomeController');
const UserController = require('../app/controllers/UserController');

Route.get('/home', HomeController.index);

Route.get('/users', UserController.index);
Route.post('/users', UserController.store);

module.exports = Route;