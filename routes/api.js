const Route = require('@engine/ApiRoute');

const UserController = require('@app/controllers/api/UserController');
const AuthController = require('@app/controllers/api/AuthController');

Route.get('/users', UserController.index, ['auth']);
Route.post('/users', UserController.store);
Route.post('/users/show', UserController.show, ['auth']);
Route.put('/users/update', UserController.update, ['auth']);
Route.post('/users/delete', UserController.delete, ['auth']);

Route.post('/login', AuthController.create);
Route.post('/logout', AuthController.logout, ['auth']);

module.exports = Route;