const Token = require('@app/models/Token');

// Utilities container
const utilities = {};

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

utilities.validatePhone = (phone) => {
	const pattern = /^01[3-9][0-9]{8}$/; // Bangladeshi phone number

	return typeof phone === 'string' && pattern.test(phone.trim()) ? phone.trim() : null;
}

module.exports = utilities;