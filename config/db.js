const mysql = require('mysql');
require('dotenv').config(); //  loads environment variables from .env file into process.env

class Database {
	constructor() {
		// Create DB connection
		this.connection = mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
		});
	}

	// Start connection
	connect() {
		this.connection.connect((error) => {
			if (error) {
				console.error('Database connection failed ', error.message);

				throw error;
			}

			console.log('MySQL connected');
		});

		// return the connection
		return this.connection; 
	}
}

const db = new Database();
const dbConn = db.connect();

module.exports = dbConn;