# MVC APP NodeJS – Documentation

> A lightweight MVC framework built on **raw Node.js** (no Express), inspired by Laravel’s developer experience.

---

## Table of Contents
1. [Introduction](./docs/introduction.md)
2. [Quick Start](./docs/quick-start)
3. [Requirements](./docs/requirements)
4. [Installation](./docs/installation)
5. [Environment Configuration](./docs/environment-configuration)
6. [Project Structure](./docs/project-structure)
7. [Application Lifecycle](./docs/application-lifecycle)
8. [Routing](./docs/routing)
9. [Middleware](./docs/middleware)
10. [Route Service Provider](./docs/route-service-provider)
11. [Controllers](./docs/controllers)
12. [Requests & Responses](./docs/requests--responses)
13. [Validation](./docs/validation)
14. [Models & Database](./docs/models--database)
15. [Migrations](./docs/migrations)
16. [Views & Templates](./docs/views--templates)
17. [File Uploads](./docs/file-uploads)
18. [Security](./docs/security)
19. [Logging & Rate Limiting](./docs/logging--rate-limiting)
20. [Error Handling](./docs/error-handling)
21. [CLI Cheatsheet](./docs/cli-cheatsheet)
22. [FAQ](./docs/faq)

---

## Introduction
This project brings a **Laravel-like workflow** to **raw Node.js**: a clean MVC structure, a custom router, middleware pipeline, a Route Service Provider, a simple view engine and a model layer powered by MySQL.

- No Express or external web frameworks.
- JSON, URL‑encoded and multipart/form‑data request parsing.
- Built-in utilities for validation, responses, and pagination.

---

## Quick Start
```bash
# 1) Clone
git clone https://github.com/alamincse/mvc-app-nodejs.git
cd mvc-app-nodejs

# 2) Install dependencies
npm install

# 3) Configure env (copy & edit)
cp .env.example .env   # if provided; otherwise edit .env directly

# 4) Run DB migrations
nodemon database      # or: node database

# 5) Start the server
nodemon server        # or: node server
```

> Default app port is read from `.env` (see **Environment Configuration**).

---

## Requirements
- Node.js 18+
- MySQL 5.7/8+
- npm 8+

---

## Installation
1. **Install packages**
   ```bash
   npm install
   npm install mysql dotenv formidable --save
   npm install nodemon --save-dev
   ```
2. **Create database** in MySQL and update `.env` accordingly.
3. **Run migrations** with `nodemon database` (creates required tables).
4. **Start the server** with `node server` or `nodemon server`.

---

## Environment Configuration
Set these keys in your `.env`:
```env
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

APP_BACKLOG=511
```

---

## Project Structure
```
project/
├── app/
│   ├── controllers/
│   │   ├── web/
│   │   └── api/
│   ├── middleware/
│   ├── models/
│   └── providers/
├── config/
│   ├── env.js
│   └── db.js
├── database/
│   ├── migrations/
│   └── index.js
├── helpers/
│   ├── globalHelper.js
│   ├── response.js
│   └── utilities.js
├── public/
│   ├── bootstrap/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── fonts/
├── routes/
│   ├── web.js
│   └── api.js
├── system/
│   ├── Route.js
│   ├── Model.js
│   ├── View.js
│   └── Middleware.js
├── views/
│   ├── layouts/
│   └── pages/
├── .env
├── package.json
└── server.js
```

---

## Application Lifecycle
1. **server.js** boots the HTTP server and loads the router.
2. **RouteServiceProvider** merges `web` and `api` routes and applies global middleware.
3. **system/Route.js** resolves the incoming request and dispatches to the controller action.
4. Controller calls **Model**/**View**/**helpers** as needed and returns a response.

---

## Routing
Define routes in `routes/web.js` and `routes/api.js`.

```js
// routes/web.js
const Route = require('../system/Route');
const UserController = require('../app/controllers/web/UserController');

Route.get('/', (req, res) => res.end('Welcome'));
Route.get('/users', UserController.index);
Route.post('/users', UserController.store);

module.exports = Route;
```

### Route Methods
- `Route.get(path, handler, [middlewares])`
- `Route.post(path, handler, [middlewares])`
- `Route.put(path, handler, [middlewares])`
- `Route.delete(path, handler, [middlewares])`

### API Prefix
All routes from `routes/api.js` are automatically prefixed with `/api` by the **Route Service Provider**.

---

## Middleware
Middleware are simple functions with signature `(req, res, next)`.

```js
// app/middleware/AuthMiddleware.js
module.exports = function AuthMiddleware(req, res, next) {
  const authorized = Boolean(req.headers['x-auth']);
  if (!authorized) {
    res.statusCode = 401;
    return res.end('Unauthorized');
  }
  next();
};
```

Attach to a route:
```js
Route.post('/users', UserController.store, [AuthMiddleware]);
```

Attach globally via **Route Service Provider** (see next section).

---

## Route Service Provider
A central place to register routes and apply global middleware like the **Route Logger** and **Rate Limiter**.

```js
// app/providers/RouteServiceProvider.js
const Route = require('../../system/Route');
const webRoutes = require('../../routes/web');
const apiRoutes = require('../../routes/api');
const RateLimiter = require('../middleware/RateLimiter');
const RouteLogger = require('../middleware/RouteLogger');

class RouteServiceProvider {
  constructor() {
    this.globalRateLimiter = new RateLimiter(60, 60 * 1000); // 60 req/min
  }

  getGlobalMiddlewares() {
    return [
      RouteLogger.handle,           // logs IP, method, path
      this.globalRateLimiter.handle // throttles per IP
    ];
  }

  applyGlobalMiddlewares() {
    const middlewares = this.getGlobalMiddlewares();
    [webRoutes, apiRoutes].forEach(group => {
      if (group?.routes?.length) {
        group.routes.forEach(route => {
          route.middlewares = [...middlewares, ...(route.middlewares || [])];
        });
      }
    });
  }

  loadRoutes() {
    const Router = new Route();
    this.applyGlobalMiddlewares();
    Router.merge(webRoutes);
    Router.mergeWithPrefix(apiRoutes, '/api');
    return Router;
  }
}

module.exports = new RouteServiceProvider().loadRoutes();
```

---

## Controllers
Controllers live under `app/controllers/{web|api}`.

```js
// app/controllers/web/UserController.js
const response = require('../../helpers/response');
const User = require('../../models/User');

class UserController {
  async index(req, res) {
    const users = await User.all();
    return response.json(res, { success: true, data: users });
  }

  async store(req, res) {
    const user = await User.create(req.body);
    return response.json(res, { success: true, data: user }, 201);
  }
}

module.exports = new UserController();
```

---

## Requests & Responses
- **Parsing**: JSON, `x-www-form-urlencoded`, and `multipart/form-data` (via `formidable`).
- **Helpers**: `helpers/response.js` provides `json`, `error`, and `validationError` helpers.

```js
// helpers/response.js (usage example)
return response.json(res, { success: true, data }, 200);
```

---

## Validation
Validation is framework‑agnostic and rule‑based (Laravel‑style):

```js
const { passes, errors } = await Validation.validate(
  { name, email, password },
  {
    name: 'required|min:3',
    email: 'required|email|unique:users,email',
    password: 'required|min:4'
  }
);

if (!passes) {
  return response.validationError(res, errors);
}
```

**Common Rules**: `required`, `min:x`, `max:x`, `email`, `unique:table,column`, `same:field`, `numeric`.

---

## Models & Database
Models extend the base `system/Model.js` class and define **table** and **fillable fields**.

```js
// app/models/User.js
const Model = require('../../system/Model');
class User extends Model {
  constructor() {
    super('users', ['name', 'email', 'password']);
  }
}
module.exports = new User();
```

### Common Methods
- `create(data)`
- `find(id)`
- `update(id, data)`
- `delete(id)` / `deleteByColumn(column, value)`
- `all()` / `paginate(page, perPage)`
- `where(field, value)` / `andWhere({...})` / `whereIn(field, values)`
- `orderBy(field, direction)`

---

## Migrations
A simple migration runner lives under `database/`.

```bash
nodemon database   # or: node database
```

Add migration files under `database/migrations` and register them in `database/index.js`.

---

## Views & Templates
A minimal template engine (`system/View.js`) renders views from `views/` with `{{ variable }}` placeholders.

```html
<!-- views/layouts/app.html -->
<html>
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

Render from controller:
```js
const View = require('../../system/View');
const html = await View.render('pages/home.html', { title: 'Home', content: 'Welcome!' });
res.end(html);
```

---

## File Uploads
`formidable` handles multipart requests.

```js
const formidable = require('formidable');

function uploadHandler(req, res) {
  const form = formidable({ multiples: false, maxFileSize: 5 * 1024 * 1024 });
  form.parse(req, (err, fields, files) => {
    if (err) return response.error(res, 'Upload failed');
    // Save files.tempFilePath or move to storage
    return response.json(res, { fields, files });
  });
}
```

Attach to a route as the handler or inside a controller.

---

## Security
- **Password Hashing**: Use Node’s `crypto` (PBKDF2 or bcrypt preferred) for secure hashes.
- **CORS**: Add a CORS middleware if exposing APIs publicly.
- **Headers**: Consider adding `X-Content-Type-Options`, `X-Frame-Options`, CSP, etc.
- **Input Sanitization**: Validate and sanitize all inputs.
- **Directory Traversal**: Sanitize file paths when serving from `public/`.

---

## Logging & Rate Limiting
### Route Logger
Logs every request (timestamp, IP, method, path):
```js
// app/middleware/RouteLogger.js
const url = require('url');
class RouteLogger {
  static handle(req, res, next) {
    const now = new Date().toISOString();
    const ip = req.socket.remoteAddress;
    const method = req.method;
    const path = url.parse(req.url).pathname;
    console.log(`[${now}] ${ip} -> ${method} ${path}`);
    next && next();
  }
}
module.exports = RouteLogger;
```

### Rate Limiter
Basic IP‑based throttling (e.g., 60 req/min). Applied globally via the Route Service Provider.

---

## Error Handling
- Return JSON errors with `helpers/response.error`.
- Wrap DB calls in `try/catch` in controllers.
- Do not leak stack traces in production.

---

## CLI Cheatsheet
```bash
# Run dev server (auto‑reload)
nodemon server

# Run migrations
nodemon database

# Lint (if configured)
npm run lint
```

---

## FAQ
**Q: How do I add a new API route?**  
A: Create it in `routes/api.js`; the provider will prefix it with `/api` automatically.

**Q: How do I add a middleware to only one route?**  
A: Pass it as the 3rd argument in the `Route.{method}` call.

**Q: Can I render HTML and JSON from the same controller?**  
A: Yes. Use `View.render` for HTML and `helpers/response.json` for JSON.

**Q: How do I change the global rate limit?**  
A: Update the `new RateLimiter(limit, windowMs)` values in the Route Service Provider.

---

**Happy hacking!**