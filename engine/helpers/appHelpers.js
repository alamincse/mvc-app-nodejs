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
if (! global.view) {
	global.view = (template, data = {}) => {
	    return View.make(template, data);
	};
}

/**
 * Debug helper: prints data and optionally stops execution
 *
 * @param {*} data 
 * @param {boolean} exit 
 */
if (! global.dd) {
	global.dd = (data, exit = false) => {
	    console.log(data);

	    if (exit) {
	        // Stop execution safely
	        throw new Error('Execution stopped by dd()');
	    }

	    // Execution stop
		// process.exit();
	};
}

/**
 * Get or generate CSRF token for a request
 *
 * @param {object} req - Incoming request object
 * @param {object} res - Response object
 * @returns {string|null} CSRF token
 */
if (! global.getCsrfToken) {
	global.getCsrfToken = (req, res) => {
	    if (!req || !res) return null;

	    const csrf = new Csrf(req, res);

	    return csrf.getToken();
	};
}

/**
 * Hash a string using HMAC-SHA256
 *
 * @param {string} str 
 * @returns {string|boolean} hashed string or false
 */
if (! global.hash) {
	global.hash = (str) => {
		const secretKey = process.env.SECRET_KEY ?? 'parbona';

	    if (typeof str === 'string' && str.length > 0) {
	        return crypto.createHmac('sha256', secretKey).update(str).digest('hex');
	    }

	    return false;
	};
}

/**
 * Validate session token (must be 40 chars long)
 *
 * @param string $token Input token
 * @return string|false Returns trimmed token if valid, otherwise false
 */
if (! global.validateToken) {
	global.validateToken = (token) => typeof token === 'string' && token.trim().length === 40 ? token.trim() : false;
}

/**
 * Parse cookie header string into an associative array
 *
 * @param string $cookieHeader Raw Cookie header (default: empty string)
 * @return array<string,string> Associative array of cookie key => value
 */
if (! global.parseCookies) {
	global.parseCookies = (cookieHeader = '') => {
	    return Object.fromEntries(
	  		cookieHeader.split(';').map(c => c.trim().split('='))
	    );
	};
}

/**
 * Extract Bearer token from headers
 *
 * @param array<string,string> $headers Associative array of HTTP headers
 * @return string|null Returns Bearer token if exists, otherwise null
 */
if (! global.getBearerToken) {
	global.getBearerToken = (headers) => {
		const authHeader = headers['authorization'] ?? '';

		return authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
	};
}

/**
 * Create a random alphanumeric string
 *
 * @param int strLength Desired string length (default: 40)
 * @return string Randomly generated string
 */
if (! global.createRandomString) {
	global.createRandomString = (strLength = 40) => {
		const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
		let output = '';

		for (let i = 1; i <= strLength; i++) {
	    	output += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
	  	}
	  	
	  	return output;
	};
} 

/**
 * Global logger instance
 *
 * @var Logger Log Logger instance for writing logs
 */
if (! global.logger) {
	global.Log = Logger;
}

/**
 * Safely parse a JSON string
 *
 * @param string|null $jsonString JSON string to parse (default: '{}')
 * @return array Returns associative array if valid JSON, otherwise empty array
 */
if (! global.parseJSON) {
	global.parseJSON = (jsonString) => {
		try {
			return JSON.parse(jsonString ?? '{}');
		} catch(err) {
			// console.log('JSON parse error:', error.message);
			Log.error(err.stack ?? err.message);

			return {};
		}
	}
}

/**
 * Normalize form data fields
 *
 * Converts single-element arrays to plain values for convenience.
 *
 * @param array<string,mixed> $fields Associative array of form fields
 * @return array|string Returns normalized array; returns empty string on error
 */
if (! global.normalizeFormData) {
	global.normalizeFormData = (fields) => {
		try {
			return Object.fromEntries(
				Object.entries(fields).map(([key, val]) => {
					if (Array.isArray(val) && val.length === 1) {
						return [key, val[0]];
					}
					
					return [key, val];
				})
			);
		} catch(err) {
			Log.error(err.stack ?? err.message);

			return '';
		}
	};
}