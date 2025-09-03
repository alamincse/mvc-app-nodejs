/**
* Globally accessible helper methods for this application!
*/
const Csrf = require('@engine/security/Csrf');
const View = require('@engine/View');
const crypto = require('crypto');

global.view = (template, data = {}) => {
	return View.make(template, data);
};

global.dd = (data) => {
	console.log(data);

	// Execution stop
	// process.exit();
};

/**
 * Get or generate CSRF token for a request
 *
 * @param {object} req - Incoming request object
 * @param {object} res - Response object
 * @returns {string} CSRF token
 */
global.getCsrfToken = (req, res) => {
	if (!req || !res) return null;

    const csrf = new Csrf(req, res);

    return csrf.getToken();
};

global.hash = (str) => {
	if (typeof str === 'string' && str.length > 0) {
		return crypto.createHmac('sha256', 'secretKey').update(str).digest('hex');
	}

	return false;
};