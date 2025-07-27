const Route = require('../system/WebRoute');

const RedirectIfAuthenticated = require('../app/middleware/RedirectIfAuthenticated');
const AuthCookieMiddleware = require('../app/middleware/AuthCookieMiddleware');
const HomeController = require('../app/controllers/HomeController');
const UserController = require('../app/controllers/UserController');
const AuthController = require('../app/controllers/AuthController');

Route.get('/home', HomeController.index, [RedirectIfAuthenticated]);
Route.get('/register', HomeController.register, [RedirectIfAuthenticated]);

Route.get('/profile', HomeController.profile, [AuthCookieMiddleware]);

module.exports = Route;