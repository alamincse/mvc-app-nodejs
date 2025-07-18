require('dotenv').config();

// Environment configurations
const environments = {
  staging: {
   		port: process.env.APP_STAGING_ENV_PORT,
    	envName: process.env.APP_STAGING_ENV_NAME,
  	},
  	development: {
  		port: process.env.APP_DEVELOPMENT_ENV_PORT,
  		envName: process.env.APP_DEVELOPMENT_ENV_NAME,
	},
  	production: {
    	port: process.env.APP_PRODUCTION_ENV_PORT,
    	envName: process.env.APP_PRODUCTION_ENV_NAME,
  	},
};

// Determine current environment from NODE_ENV
const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';

// Select the correct environment config
const envToExport = environments[currentEnv] || environments.staging;

// Export the environment config
module.exports = envToExport;