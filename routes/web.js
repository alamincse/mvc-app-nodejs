const Route = require('../system/Route');
const AuthMiddleware = require('../app/middleware/AuthMiddleware');
const HomeController = require('../app/controllers/HomeController');
const UserController = require('../app/controllers/UserController');
const AuthController = require('../app/controllers/AuthController');

Route.get('/home', HomeController.index);

Route.get('/users', UserController.index);
Route.post('/users', UserController.store);

Route.post('/login', AuthController.create);
Route.post('/logout', AuthController.logout, [AuthMiddleware]);

module.exports = Route;