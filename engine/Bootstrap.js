require('dotenv').config();

// Define essential environment variables
const requiredEnvVars = [
  'DB_CONNECTION',
  'DB_HOST',
  'DB_USERNAME',
  'DB_DATABASE',
  'DB_PORT',
  'SECRET_KEY',
];

// Validate each variable
for (const envName of requiredEnvVars) {
	const value = process.env[envName];

	if (!value || value.trim() === '') {
		const secretKeyError = `SECRET_KEY is missing in .env file. This key is required for encryption, sessions and security features. Please set a valid SECRET_KEY (at least 40 or 64 characters).`;

		const othersKeyError = `Environment variable ${envName} is missing or empty. Please check your .env file.`;

		const errorMessage = (envName === 'SECRET_KEY') ? secretKeyError : othersKeyError;

    	Log.error(errorMessage);

    	// Execution stop
    	process.exit(1); // Stop application
  	}
}