/**
 * Application configuration
 * 
 * This file holds global application settings such as the app name and API prefix.
 * Inspired by Laravel's `config/app.php`, these values can be easily managed 
 * and overridden using environment variables (.env file).
 * 
 * @property {string} name       - The application name, defaults to "MVC APP Node.js"
 *                                 Can be overridden by setting APP_NAME in the `.env` file.
 * 
 * @property {string} apiPrefix  - The global API route prefix, defaults to "/api"
 *                                 Can be overridden by setting. Example: `/api`, `/v1`, `/partner`, `/mobile`
 */
require('dotenv').config();

const app = {
	name: process.env.APP_NAME ?? 'MVC APP Node.js',

	// Configurable API prefix (default: `/api`)
	apiPrefix: '/api',
};

module.exports = app;