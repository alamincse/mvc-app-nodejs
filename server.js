const http = require('http');
const env = require('./config/env');
const Route = require('./routes/web');

class AppServer {
	constructor(port, host, backlog) {
		this.port = port;
		this.host = host;
		this.backlog = backlog;
	}

	createServer() {
		try {
			const server = http.createServer((req, res) => {
				// handle all incoming client requests!
				Route.resolve(req, res); 
			});

			server.listen(this.port, this.host, this.backlog, () => {
				console.log(`Server is running at http://${this.host}:${this.port}`);
			});

			server.on('error', (error) => {
				console.log('Server error:', error.message);
			});
		} catch (e) {
			console.log('Caught exception:', e.message);
		}
	}
}

// Create and start the server
const server = new AppServer(env.port, env.host, env.backlog);

server.createServer();