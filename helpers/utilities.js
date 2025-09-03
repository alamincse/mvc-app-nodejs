const Token = require('../app/models/Token');
const crypto = require('crypto');

// Utilities container
const utilities = {};

utilities.parseJSON = (jsonString) => {
	try {
		return JSON.parse(jsonString ?? '{}');
	} catch(error) {
		console.log('JSON parse error:', error.message);

		return {};
	}
}


utilities.hash = (str) => {
	if (typeof str === 'string' && str.length > 0) {
		return crypto.createHmac('sha256', 'secretKey').update(str).digest('hex');
	}

	return false;
}

utilities.createRandomString = (strLength) => {
	const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let output = '';

	for (let i = 1; i <= strLength; i++) {
    	output += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  	}
  	
  	return output;
}

// return token (From Bearer Token) or just null
utilities.getBearerToken = (headers) => {
	const authHeader = headers['authorization'] ?? '';

	return authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
}

utilities.normalizeFormData = (fields) => {
	return Object.fromEntries(
		Object.entries(fields).map(([key, val]) => {
			if (Array.isArray(val) && val.length === 1) {
				return [key, val[0]];
			}
			
			return [key, val];
		})
	);
}


// verify user token
utilities.verifyToken = async (bearerToken) => {
	const token = await Token.where('token', bearerToken);

	if (! token) return false;

	const now = new Date();
	const expiresAt = new Date(token.expires_at);

	if (expiresAt < now) return false;

	return {
		user_id: token.user_id,
		token: token.token,
	};
}

utilities.toBDTime = (date) => {
	const utcDate = new Date(date);

	return utcDate.toLocaleString('sv-SE', {
		timeZone: 'Asia/Dhaka',
		hour12: false
	}).replace(' ', 'T')
}

utilities.parseCookies = (cookieHeader = '') => {
    return Object.fromEntries(
  		cookieHeader.split(';').map(c => c.trim().split('='))
    );
}

// validation rules
utilities.validateToken = (token) => typeof token === 'string' && token.trim().length === 40 ? token.trim() : false;

utilities.validatePhone = (phone) => {
	const pattern = /^01[3-9][0-9]{8}$/; // Bangladeshi phone number

	return typeof phone === 'string' && pattern.test(phone.trim()) ? phone.trim() : null;
}

module.exports = utilities;