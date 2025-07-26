const Route = require('../system/WebRoute');

const AuthMiddleware = require('../app/middleware/AuthMiddleware');
const HomeController = require('../app/controllers/HomeController');
const UserController = require('../app/controllers/UserController');
const AuthController = require('../app/controllers/AuthController');

Route.get('/home', HomeController.index);
Route.get('/register', HomeController.register);
Route.get('/profile', HomeController.profile);

Route.post('/login', AuthController.create);
Route.post('/logout', AuthController.logout, [AuthMiddleware]);

module.exports = Route;