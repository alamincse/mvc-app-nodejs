const Route = require('../system/ApiRoute');

const AuthMiddleware = require('../app/middleware/AuthMiddleware');
const UserController = require('../app/controllers/UserController');
const AuthController = require('../app/controllers/AuthController');

Route.get('/users', UserController.index, [AuthMiddleware]);
Route.post('/users', UserController.store);

Route.post('/login', AuthController.create);
Route.post('/logout', AuthController.logout, [AuthMiddleware]);

module.exports = Route;