class Middleware {
	static async handle(middlewares, req, res, finalHandler) {
		let index = 0;

		const next = async () => {
			if (index < middlewares.length) {
				const current = middlewares[index++];

				// Call actual middleware (e.g. Auth, Role)
				await current(req, res, next);
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