## `Node.js` MVC Framework (No Express)
A lightweight **Node.js** project that follows the **MVC (Model-View-Controller)** architecture, built from scratch, without using any framework like `Express`. This project is ideal for learning the core backend architecture, routing mechanisms and `MySQL` integration in raw Node.js.


## Key Features
- **Custom Routing System**
- **MVC Folder Structure**
- **Middleware Support**
- **Route Service Provider Support(Handles `web` and `api` routes with `/api` prefix)**
- **MySQL Integration (using `mysql` driver)**
- **Built-in password hashing (`crypto`)**
- **Custom View Engine (`View.js`)**
- **Bootstrap Frontend (inside `/public`)**
- **File Upload Support via `formidable`**
- **Form Input Fields Validation (`Server-side` validation with customizable `rules` and `messages`)**
- **Environment Configuration Support** (`.env`)
- **Request Body Parsing**

  &emsp;• `application/json`  
  &emsp;• `x-www-form-urlencoded`  
  &emsp;• `multipart/form-data` (via `formidable`) 


## Sample Features
 - User Registration & Login
 - Form Validation
 - Display Error Messages
 - Edit & Delete records
 - User Logout
 - API Routes under `/api`

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

## Getting Started
<pre lang="bash">
git clone git@github.com:alamincse/crud-app-mvc-nodejs.git
cd crud-app-mvc-nodejs
</pre>

## Install Dependencies
<pre lang="bash">
npm install
</pre>

## Required Packages Install
<pre lang="bash">
npm install mysql
npm install dotenv
npm install formidable (Support `multipart/form-data` or `form-data` in postman)
npm install nodemon --save-dev</pre>

## Start the server
- `node server` or `nodemon server`


## Run Database Migration
Run the following command to create tables: Make sure `.env` is properly configured with your `MySQL` credentials.
- `nodemon database`

## Routing
#### Define your routes in `routes/web.js` or `routes/api.js`:
#### `routes/web.js`
<pre lang="js">
const Route = require('../system/Route');
const AuthMiddleware = require('../app/middleware/AuthMiddleware');
const UserController = require('../app/controllers/UserController');

Route.get('/users', UserController.index);
Route.post('/users', UserController.store);

module.exports = Route;</pre>

## Middleware
<pre lang="js">
const Route = require('../system/Route');
const AuthMiddleware = require('../app/middleware/AuthMiddleware');
const UserController = require('../app/controllers/UserController');

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
- `users` → Name of the database table
- `['name', 'email', 'password']` → Array of fields that are allowed for mass assignment(Fillable fields)


## View Engine
The `View.js` engine renders HTML files with `{{ title }}` and `{{ content }}` placeholders, like a mini `Blade` or `EJS` system.
<!-- views/layouts/main.html -->
	<html>
		<head>
	  		<title>{{ title }}</title>
  		</head>
	  	<body>
    		{{ content }}
	  	</body>
	</html>

## Environment Configuration
<pre lang="js">
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

## Form Validation Rules
This document describes the input validation rules used throughout the application.
Validation is handled manually (without any framework) using custom helper functions.

---

### Common Validation Rules

| Rule         | Description                                                        | Example                              |
|--------------|--------------------------------------------------------------------|--------------------------------------|
| `required`   | Field must not be empty                                            | `name: required`                     |
| `min:length` | Minimum character length                                           | `name: min:3`                        |
| `max:length` | Maximum character length                                           | `name: max:50`                       |
| `email`      | Validates if input is a valid email format                         | `email: required|email`              |
| `unique`     | Ensures the value is not already present in DB                     | `email: unique:users,email`          |
| `same`       | Matches another field value (like confirm password)                | `confirm_password: same:password`    |
| `numeric`    | Ensures the field is a number                                      | `age: numeric`                       |
---

### Example: User Registration Validation

<pre lang="js">
{
  name: 'required|min:3',
  email: 'required|email|unique:users,email',
  password: 'required|min:4',
  confirm_password: 'required|same:password'
}</pre>


## Model Class Methods Reference

| Method                     | Description                                                   | Parameters                                      | Returns                                         |
|----------------------------|---------------------------------------------------------------|------------------------------------------------|------------------------------------------------|
| `create(data)`             | Inserts a new record and returns the created record           | `data` (object): key-value pairs for fillable fields | Promise resolving to the inserted record object |
| `find(id)`                 | Finds a record by its primary key (`id`)                      | `id` (number): primary key               | Promise resolving to the found record or `null`|
| `update(id, data)`         | Updates a record by ID and returns the updated record         | `id` (number), `data` (object): fields to update | Promise resolving to the updated record or `false` if no fields provided |
| `delete(id)`               | Deletes a record by ID                                         | `id` (number)                            | Promise resolving to the deletion result       |
| `deleteByColumn(column, value)` | Deletes records matching a column and value                  | `column` (string), `value` (any)                | Promise resolving to the deletion result       |
| `all()`                    | Retrieves all records from the table                           | None                                           | Promise resolving to an array of all records   |
| `where(field, value)`      | Finds the first record matching a specific field and value    | `field` (string), `value` (any)                 | Promise resolving to the found record or `null`|
| `andWhere(fields)`         | Finds the first record matching multiple field-value pairs    | `fields` (object): `{field1: val1, field2: val2}` | Promise resolving to the found record or `null`|
| `paginate(page = 1, perPage = 10)` | Retrieves paginated records based on page number and size    | `page` (number), `perPage` (number)             | Promise resolving to `{ currentPage, perPage, data: [] }` |
| `whereIn(field, values)`   | Retrieves records where a field matches any value in the array| `field` (string), `values` (array)               | Promise resolving to an array of matching records |
| `orderBy(field, direction = 'ASC')` | Retrieves records ordered by a field in ascending/descending order | `field` (string), `direction` ('ASC' or 'DESC') | Promise resolving to an array of ordered records |

---

## Example Usage

<pre lang="js">
// Create a user
const newUser = await User.create({ name: 'Al-Amin Sarker', email: 'alamin.sarker@gmail.com', password: '123' });

// Find user by ID
const user = await User.find(1);

// Update user by ID
const updatedUser = await User.update(1, { name: 'Updated Name' });

// Delete user by ID
await User.delete(1);

// Get all users
const allUsers = await User.all();

// Find user by condition
const admin = await User.where('role', 'admin');

// Find user by multiple conditions
const specificUser = await User.andWhere({ email: 'alamin@gmail.com', name: 'Al-Amin' });

// Paginate users (page 2, 5 per page)
const pagedUsers = await User.paginate(2, 5);

// Find users with IDs in array
const usersIn = await User.whereIn('id', [1, 2, 3]);

// Get users ordered by ID descending
const usersDesc = await User.orderBy('id', 'DESC');
</pre>

## Author
**Al-Amin Sarker**