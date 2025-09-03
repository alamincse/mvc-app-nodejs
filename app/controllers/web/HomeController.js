const response = require('@helpers/response');

class HomeController {
	async index(req, res) {
		try {
			const html = await view('home', {
				title: 'Node MVC',
				heading: 'Welcome to Node View',
				message: 'This is coming from the View class!',
			});

			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(html);
		} catch (err) {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end(err);
		}
	}

	async register(req, res) {
		try {
			const html = await view('register', {
				title: 'User Register - Node MVC',
				heading: 'Welcome to Node View',
				message: 'This is coming from the View class!',
			});

			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(html);
		} catch (err) {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end(err);
		}
	}

	async profile(req, res) {
		try {
			const html = await view('profile', {
				title: 'User Profile - Node MVC',
				heading: 'Welcome to Node View',
				message: 'This is coming from the View class!',
			});

			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(html);
		} catch (err) {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end(err);
		}
	}
}

module.exports = new HomeController();