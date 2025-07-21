## `Node.js` MVC Framework (No Express)
A lightweight `Node.js` project that follows the **MVC (Model-View-Controller)** architecture, built without any framework like `Express`. Ideal for learning backend architecture, routing and database(`mysql`) interaction from scratch.


## Key Features
- **Custom Routing System**
- **MVC Folder Structure**
- **MySQL Integration (using `mysql` package)**
- **Built-in password hashing with crypto**
- **Handles `application/json`, `x-www-form-urlencoded`, and `multipart/form-data`**
- **File Upload Support via `formidable`**

## Install Packages
- **npm install mysql**
- **npm install dotenv**
- **npm install nodemon**
- **npm install formidable** (Support `multipart/form-data` or `form-data` in postman)

## Migration Run (Table create)
- **nodemon database**

## Start the server
- `node server` or 
- `nodemon server`

## Route Define
#### `routes/web.js`
<pre lang="js">
const Route = require('../system/Route');
const UserController = require('../app/controllers/UserController');

Route.get('/home', HomeController.index);

Route.get('/users', UserController.index);
Route.post('/users', UserController.store);

module.exports = Route;</pre>


## Controller Define
#### `app/controllers/UserController.js`
<pre lang="js">
const response = require('../../helpers/response');
const User = require('../models/User');

class UserController {
	async index(req, res) {
		try {
			const result = await User.all();

			return response.json(res, {
				success: true,
				message: 'Success',
				data: result,
			});
		} catch (err) {
			console.log(err);

			return response.error(res, 'Failed');
		}
	}
}

module.exports = new UserController();</pre>