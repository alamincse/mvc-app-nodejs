const mysql = require('mysql');
require('dotenv').config(); //  loads environment variables from .env file into process.env

// Create DB connection
const dbConn = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});

dbConn.connect(function (error) {
	if (error) throw error;

	console.log('MySQL connected');
});

module.exports = dbConn;