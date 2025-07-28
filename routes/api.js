const Route = require('../system/ApiRoute');

const UserController = require('../app/controllers/api/UserController');
const AuthController = require('../app/controllers/api/AuthController');
const AuthMiddleware = require('../app/middleware/AuthMiddleware');

Route.get('/users', UserController.index, [AuthMiddleware]);
Route.post('/users', UserController.store);
Route.post('/users/show', UserController.show, [AuthMiddleware]);
Route.post('/users/update', UserController.update, [AuthMiddleware]);
Route.post('/users/delete', UserController.delete, [AuthMiddleware]);

Route.post('/login', AuthController.create);
Route.post('/logout', AuthController.logout, [AuthMiddleware]);

module.exports = Route;