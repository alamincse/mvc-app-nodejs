const env = require('./config/env');

const PM2 = {
	apps: [
		{
			name: 'mvc-app',         // Process name
	      	script: './server.js',   // Entry point
	      	watch: true,             // Auto restart on file changes
	      	instances: 1,            // Number of instances (use 'max' for cluster)
	      	exec_mode: 'fork',       // Fork or cluster mode
	      	env_staging: {          
		        NODE_ENV: 'staging',
		        PORT: env?.port || 3000
	      	},
	      	env_development: {                  
		        NODE_ENV: 'development',
		        PORT: env?.port || 4000
	      	},
	      	env_production: {       
		        NODE_ENV: 'production',
		        PORT: env?.port || 5000
	      	}
		}
	]
}

module.exports = PM2