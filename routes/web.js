const Route = require('../system/WebRoute');

const AuthCookieMiddleware = require('../app/middleware/AuthCookieMiddleware');
const HomeController = require('../app/controllers/HomeController');
const UserController = require('../app/controllers/UserController');
const AuthController = require('../app/controllers/AuthController');

Route.get('/home', HomeController.index);
Route.get('/register', HomeController.register);
Route.get('/profile', HomeController.profile, [AuthCookieMiddleware]);

Route.post('/login', AuthController.create);
Route.post('/logout', AuthController.logout, [AuthCookieMiddleware]);

module.exports = Route;