## `Node.js` MVC Framework (No Express)
A lightweight **Node.js** project that follows the **MVC (Model-View-Controller)** architecture, built from scratch, without using any framework like `Express`. This project is ideal for learning the core backend architecture, routing mechanisms and `MySQL` integration in raw Node.js.


## Key Features
- **Custom Routing System**
- **MVC Folder Structure**
- **Middleware Support**
- **Route Service Provider Support(Handles `web` and `api` routes with `/api` prefix)**
- **MySQL Integration (using `mysql` driver)**
- **Built-in password hashing (`crypto`)**
- **Environment Configuration with `.env`**
- **Custom View Engine (`View.js`)**
- **Bootstrap Frontend (inside `/public`)**
- **File Upload Support via `formidable`**
- **Request Body Parsing**

  &emsp;• `application/json`  
  &emsp;• `x-www-form-urlencoded`  
  &emsp;• `multipart/form-data` (via `formidable`) 

## Folder Structure
<pre lang="bash">
project/
├── app/
│ ├── controllers/
│ │ ├── web/
│ │ └── api/
│ ├── middleware/
│ └── models/
│ └── providers/
├── config/
│ ├── env.js
│ └── db.js
├── database/
│ ├── migrations/
│ └── index.js
├── helpers/
│ ├── globalHelper.js
│ ├── response.js
│ └── utilities.js
├── public/
│ ├── bootstrap/
│ ├── css/
│ ├── js/
│ ├── images/
│ └── fonts/
├── routes/
│ ├── web.js
│ └── api.js
├── system/
│ ├── Route.js
│ ├── Model.js
│ ├── View.js
│ └── Middleware.js
├── views/
│ ├── layouts/
│ └── pages
├── .env
├── package.json
├── server.js
└── README.md</pre>

## Install Packages
<pre lang="bash">
npm install mysql
npm install dotenv
npm install formidable (Support `multipart/form-data` or `form-data` in postman)
npm install nodemon --save-dev</pre>


## Database Migration
Run the following command to create tables: Make sure `.env` is properly configured with your `MySQL` credentials.
- `nodemon database`

## Start the server
- `node server` or `nodemon server`

## Routing
#### Define your routes in `routes/web.js` or `routes/api.js`:
#### `routes/web.js`
<pre lang="js">
const Route = require('../system/Route');
const AuthMiddleware = require('../app/middleware/AuthMiddleware');
const UserController = require('../app/controllers/UserController');

Route.get('/users', UserController.index);
Route.post('/users', UserController.store);

// add middleware(`AuthMiddleware`)
Route.post('/users', UserController.store, [AuthMiddleware]); 
module.exports = Route;</pre>


## Controller Example
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


## Model Example
#### `app/models/User.js`
<pre lang="js">
const Model = require('../../system/Model');

class User extends Model {
  constructor() {
	super('users', [
	  'name',
	  'email',
	  'password',
	]);
  }
}

module.exports = new User();</pre>

## Environment Variables
<pre lang="bash">
DB_CONNECTION=mysql
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=node_crud
DB_PORT=3306

APP_STAGING_ENV_PORT=3000
APP_STAGING_ENV_NAME=staging

APP_DEVELOPMENT_ENV_PORT=4000
APP_DEVELOPMENT_ENV_NAME=development

APP_PRODUCTION_ENV_PORT=5000
APP_PRODUCTION_ENV_NAME=production

APP_BACKLOG=511</pre>

## License
This project is open-source and free to use for educational or personal use.

## Author
**Al-Amin Sarker**