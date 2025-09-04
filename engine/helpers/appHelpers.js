/**
 * Globally accessible helper methods for this application!
 *
 * - Namespaced under `helper` to avoid global pollution
 * - Secret keys loaded from .env
 * - Safe debug and CSRF handling
 */
require('dotenv').config();

const Logger = require('@engine/security/Logger');
const Csrf = require('@engine/security/Csrf');
const View = require('@engine/View');
const crypto = require('crypto');


/**
 * Render a view template with data
 *
 * @param {string} template 
 * @param {object} data 
 * @returns {string} Rendered HTML
 */
global.view = (template, data = {}) => {
    return View.make(template, data);
};

/**
 * Debug helper: prints data and optionally stops execution
 *
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
 *
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
 *
 * @param {string} str 
 * @returns {string|boolean} hashed string or false
 */
global.hash = (str) => {
	const secretKey = process.env.SECRET_KEY ?? 'parbona';

    if (typeof str === 'string' && str.length > 0) {
        return crypto.createHmac('sha256', secretKey).update(str).digest('hex');
    }

    return false;
};

/**
 * Validate session token (must be 40 chars long)
 *
 * @param string $token Input token
 * @return string|false Returns trimmed token if valid, otherwise false
 */
global.validateToken = (token) => typeof token === 'string' && token.trim().length === 40 ? token.trim() : false;

/**
 * Parse cookie header string into an associative array
 *
 * @param string $cookieHeader Raw Cookie header (default: empty string)
 * @return array<string,string> Associative array of cookie key => value
 */
global.parseCookies = (cookieHeader = '') => {
    return Object.fromEntries(
  		cookieHeader.split(';').map(c => c.trim().split('='))
    );
};

/**
 * Extract Bearer token from headers
 *
 * @param array<string,string> $headers Associative array of HTTP headers
 * @return string|null Returns Bearer token if exists, otherwise null
 */
global.getBearerToken = (headers) => {
	const authHeader = headers['authorization'] ?? '';

	return authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
};

/**
 * Create a random alphanumeric string
 *
 * @param int strLength Desired string length (default: 40)
 * @return string Randomly generated string
 */
global.createRandomString = (strLength = 40) => {
	const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let output = '';

	for (let i = 1; i <= strLength; i++) {
    	output += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  	}
  	
  	return output;
}

/**
 * Global logger instance
 *
 * @var Logger Log Logger instance for writing logs
 */
global.Log = Logger;