/**
 * AppServer
 *
 * Node.js HTTP server class to handle both static files and dynamic routes.
 *
 * Features:
 *  - Serves static files via StaticFileHandler
 *  - Resolves dynamic routes using RouteServiceProvider
 *  - Configurable host, port and backlog
 *  - Handles server errors gracefully
 */
require('module-alias/register'); // load module alias register(first)
require('@engine/helpers/appHelpers'); // Load all global helper methods!
require('@engine/Bootstrap'); // Load application bootstrap

const http = require('http');
const env = require('@config/env');
const Route = require('@app/providers/RouteServiceProvider');
const StaticFileHandler = require('@engine/StaticFileHandler');

class AppServer {
	/**
   	 * Creates an instance of AppServer.
	 *
	 * @param {number} port - The port number to listen on
	 * @param {string} host - The host IP or domain
	 * @param {number} backlog - Maximum length of the pending connections queue
	 */
	constructor(port, host, backlog) {
		/**
	     * @type {number} Server port
	     */
		this.port = port;

		/**
	     * @type {string} Server host
	     */
		this.host = host;

		/**
	     * @type {number} Server backlog
	     */
		this.backlog = backlog;
	}

	/**
   	 * Creates and starts the HTTP server.
   	 * @returns {void}
   	 */
	createServer() {
		try {
			const server = http.createServer((req, res) => {
				// Try to serve static file first
				const isStatic = StaticFileHandler.serve(req, res);

				// If not static, process dynamic route
				if (! isStatic) {
					// handle all incoming client requests!
					Route.resolve(req, res); 
				}
			});

			/**
       		 * Start listening on configured host, port and backlog.
	         */
			server.listen(this.port, this.host, this.backlog, () => {
				Log.info(`Server is running at http://${this.host}:${this.port}`);
			});

			/**
		     * Handle server-level errors.
		     */
			server.on('error', (error) => {
				Log.error('Server error: ', error.stack ?? error.message);
			});
		} catch (err) {
			Log.error('Caught exception: ', err.stack ?? err.message);
		}
	}
}

/**
 * Bootstrap and start the server
 * Loads environment config, global helpers and bootstrap.
 */
const server = new AppServer(env.port, env.host, env.backlog);

server.createServer();