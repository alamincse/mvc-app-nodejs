/**
 * Middleware Manager
 * 
 * This class handles resolving middleware aliases to actual functions,
 * executing middleware chains sequentially and safely calling the final controller.
 * Inspired by Laravel's middleware system.
 * 
 * Usage:
 *   const Middleware = require('@engine/Middleware');
 *   
 *   // Resolve middleware aliases (array of strings or functions)
 *   const resolved = Middleware.resolve(['guest', 'auth.cookie'], 'web');
 *   
 *   // Execute middleware chain
 *   await Middleware.handle(resolved, req, res, controllerFunction/finalHandler);
 */
const kernel = require('@app/Kernel');

class Middleware {
	/**
     * Resolve middleware aliases to actual functions
     *
     * @param {string|string[]|Function|Function[]} middlewares - alias string(s) or function(s)
     * @param {string} [group='web'] - group name (web or api)
     * @returns {Function[]} Array of middleware functions
     */
	static resolve(middlewares, group) {
		try {
			if (! Array.isArray(middlewares)) middlewares = [middlewares];

		    return middlewares?.map(middlewareName => { 
		    	// If middleware is already a function, use directly!
      			if (typeof middlewareName === 'function') return middlewareName;

      			// Lookup middleware in requested group, fallback to web/api
		      	const middleware = kernel[group]?.[middlewareName] ?? kernel['web']?.[middlewareName] ?? kernel['api']?.[middlewareName];

 		      	if (! middleware) {
		      		Log.error(`Middleware "${middlewareName}" not found in ${group} group`);

		        	throw new Error(`Middleware "${middlewareName}" not found in ${group} group`);
		      	}

		      	return middleware;
		    });
		} catch (err) {
			Log.error(err.stack ?? err.message);
		}
  	}

  	/**
   	 * Execute a middleware chain sequentially
   	 *
   	 * @param {Function[]} middlewares - array of middleware functions (req,res,next)
   	 * @param {import('http').IncomingMessage} req - Node.js request object
   	 * @param {import('http').ServerResponse} res - Node.js response object
   	 * @param {Function} finalHandler - controller function (req,res)
   	 */
	static async handle(middlewares, req, res, finalHandler) {
		try {
			let index = 0;

			const next = async () => {
				if (index < middlewares.length) {
					const currentMiddleware = middlewares[index++];

					// Call actual middleware (e.g. Auth, Role)
					await currentMiddleware(req, res, next);
				} else {
					// Middleware complete → now call controller (All middleware passed)
					// like matchedRoute.handler(req, res) in Route.js file
					finalHandler(req, res);
				}
			};

			await next();
		} catch (err) {
			Log.error(err.stack ?? err.message);
			
			res.writeHead(500, { 'Content-Type': 'application/json' });

			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	}
}

module.exports = Middleware;