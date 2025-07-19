const response = require('../../helpers/response');

class HomeController {
	index(req, res) {
		response.json(res, {
			message: 'This is a home page',
		});
	}
}

module.exports = new HomeController();