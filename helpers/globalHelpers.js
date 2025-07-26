/**
* Globally accessible methods for this application!
*/
const View = require('../system/View');

global.view = (template, data = {}) => {
	return View.make(template, data);
};

global.dd = (data) => {
	console.log(data);

	// Execution stop
	process.exit();
};
