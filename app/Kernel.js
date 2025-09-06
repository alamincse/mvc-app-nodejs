/**
 * Kernel.js
 * 
 * This file defines all middleware used in the application, grouped by route type.
 * Inspired by Laravel's HTTP Kernel, it allows alias-based middleware resolution
 * for both 'web' and 'api' routes.
 * 
 * Usage:
 *   const middlewares = require('@app/Kernel');
 *   
 *   // Access web middleware
 *   const guestMiddleware = middlewares.web.guest;
 *   
 *   // Access API middleware
 *   const authMiddleware = middlewares.api.auth;
 * 
 * Middleware Groups:
 *  - web: Middleware for browser-based routes (HTML pages, session-based)
 *  - api: Middleware for API routes (JSON responses, token-based)
 */
const RedirectIfAuthenticated = require('@app/middleware/RedirectIfAuthenticated');
const AuthCookieMiddleware = require('@app/middleware/AuthCookieMiddleware');
const AuthMiddleware = require('@app/middleware/AuthMiddleware');

const middlewares = {
	'web': {
		'guest': RedirectIfAuthenticated,
    	'auth.cookie': AuthCookieMiddleware,
	},
	'api': {
		'auth': AuthMiddleware,
	}
};

module.exports = middlewares;