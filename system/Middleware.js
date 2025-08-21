class Middleware {
	static async handle(middlewares, req, res, finalHandler) {
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
	}
}

module.exports = Middleware;