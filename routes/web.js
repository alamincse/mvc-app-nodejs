const Route = require('@engine/WebRoute');

const HomeController = require('@app/controllers/web/HomeController');

Route.get('/', HomeController.index, ['guest']);
Route.get('/register', HomeController.register, ['guest']);

Route.get('/profile', HomeController.profile, ['auth.cookie']);

module.exports = Route;