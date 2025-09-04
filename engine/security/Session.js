const crypto = require('crypto');

/**
 * Simple in-memory Session management class
 * 
 * - Stores sessions in a static object `Session.sessions`
 * - Each session has a unique sessionId stored in a cookie
 * - CSRF tokens or other session data can be stored in `this.data`
 */
class Session {
	// Static object to hold all sessions in memory
	static sessions = {};

	/**
   	 * Constructor initializes session for a request
   	 *
     * @param {http.IncomingMessage} req - Node.js request object
     * @param {http.ServerResponse} res - Node.js response object
     */
	constructor(req, res) {
	    this.req = req;
	    this.res = res;

	    // Parse cookies from request headers
	    let cookies = {}; 

	    if (req?.headers?.cookie) {
	      	req.headers.cookie.split(';')?.forEach(cookie => {
	        	const parts = cookie?.split('=');

	        	cookies[parts[0]?.trim()] = parts[1]?.trim();
	      	});
	    }

	    // Check if client already has a sessionId cookie.
	    this.sessionId = cookies.sessionId;

	    // If no session exists or sessionId is invalid, create new session!
	    if (!this.sessionId || !Session.sessions[this.sessionId]) {
	      	this.sessionId = crypto.randomBytes(40).toString('hex');

	      	// Initialize session data in static sessions object
	      	Session.sessions[this.sessionId] = {};

	      	// Set session cookie in response(Client Response) if res is available
	      	if (res && res.setHeader) {
	      		res.setHeader('Set-Cookie', `sessionId=${this.sessionId}; HttpOnly; Path=/`);
	      	}
	    }

	    // Reference to current session data
	    this.data = Session.sessions[this.sessionId];
  	}

  	/**
   	 * Get a value from session
   	 *
     * @param {string} key
     * @returns {any} value stored in session
     */
  	get(key) {
	    return this.data[key];
	}

	/**
     * Set a value in session
     *
     * @param {string} key
     * @returns {any} value
     */
	set(key, value) {
	    this.data[key] = value;
	}

	/**
   	 * Get all session data
   	 *
	 * @returns {Object} all key-value pairs in session
	 */
	all() {
	    return this.data;
	}
}

module.exports = Session;