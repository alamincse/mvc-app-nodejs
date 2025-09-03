/**
 * Globally accessible helper methods for this application!
 * - Namespaced under `helper` to avoid global pollution
 * - Secret keys loaded from .env
 * - Safe debug and CSRF handling
 */
require('dotenv').config();

const Csrf = require('@engine/security/Csrf');
const View = require('@engine/View');
const crypto = require('crypto');


/**
 * Render a view template with data
 * @param {string} template 
 * @param {object} data 
 * @returns {string} Rendered HTML
 */
global.view = (template, data = {}) => {
    return View.make(template, data);
};

/**
 * Debug helper: prints data and optionally stops execution
 * @param {*} data 
 * @param {boolean} exit 
 */
global.dd = (data, exit = false) => {
    console.log(data);

    if (exit) {
        // Stop execution safely
        throw new Error('Execution stopped by dd()');
    }

    // Execution stop
	// process.exit();
};

/**
 * Get or generate CSRF token for a request
 * @param {object} req - Incoming request object
 * @param {object} res - Response object
 * @returns {string|null} CSRF token
 */
global.getCsrfToken = (req, res) => {
    if (!req || !res) return null;

    const csrf = new Csrf(req, res);

    return csrf.getToken();
};

/**
 * Hash a string using HMAC-SHA256
 * @param {string} str 
 * @returns {string|boolean} hashed string or false
 */
global.hash = (str) => {
	const SECRET_KEY = process.env.SECRET_KEY ?? 'parbona';

    if (typeof str === 'string' && str.length > 0) {
        return crypto.createHmac('sha256', SECRET_KEY).update(str).digest('hex');
    }

    return false;
};