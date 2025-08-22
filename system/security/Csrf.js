const crypto = require('crypto');
const Session = require('./Session');

/**
 * Csrf Class
 * 
 * This class provides CSRF (Cross-Site Request Forgery) token management.
 * It generates, retrieves and verifies CSRF tokens to protect against
 * CSRF attacks in this application using a custom Session class.
 */
class Csrf {
	constructor(req, res) {
		// Initialize a session instance for the current request and response
	    this.session = new Session(req, res);

	    // Key used to store the CSRF token in the session
	    this.tokenKey = "_csrf_token";
  	}

  	/**
  	 * Retrieve the CSRF token for views or forms.
  	 * If it does not exist, create a new one and store it in the session.
  	 * 
  	 * @returns {string} The CSRF token
  	 */
	getToken() {
	    if (!this.session.get(this.tokenKey)) {
	    	// Generate and set a new token if not present
      		this.session.set(this.tokenKey, crypto.randomBytes(40).toString('hex'));
	    }

	    return this.session.get(this.tokenKey);
  	}

  	/**
  	 * Verify that the provided CSRF token matches the token stored in session.
  	 * 
  	 * @param {string} token - The token to verify
  	 * @returns {boolean} True if valid, false otherwise
  	 */
  	verifyToken(token) {
     	return token && token === this.session.get(this.tokenKey);
  	}
}

module.exports = Csrf;