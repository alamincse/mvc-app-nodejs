require('dotenv').config();

// Environment configurations
const environments = {
  staging: {
      host: process.env.DB_HOST || 'localhost',
   		port: process.env.APP_STAGING_ENV_PORT || 3000,
    	name: process.env.APP_STAGING_ENV_NAME || 'staging',
      backlog: process.env.APP_BACKLOG || 511,
  	},
  	development: {
      host: process.env.DB_HOST || 'localhost',
  		port: process.env.APP_DEVELOPMENT_ENV_PORT || 4000,
  		name: process.env.APP_DEVELOPMENT_ENV_NAME || 'development',
      backlog: process.env.APP_BACKLOG || 511,
	},
  	production: {
      host: process.env.DB_HOST || 'localhost',
    	port: process.env.APP_PRODUCTION_ENV_PORT || 5000,
    	name: process.env.APP_PRODUCTION_ENV_NAME || 'production',
      backlog: process.env.APP_BACKLOG || 511,
  	},
};

// Determine current environment from NODE_ENV
const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';

// Select the correct environment config
const envToExport = environments[currentEnv] || environments.staging;

// Export the environment config
module.exports = envToExport;