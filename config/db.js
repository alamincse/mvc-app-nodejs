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

	// Create fresh database
	// const createDB =`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`;

	// dbConn.query(createDB, function (error, result) {
	// 	if (error) throw error;

	// 	console.log('Database created');
	// });

	// create users table
	const createUsersTable = `
		CREATE TABLE IF NOT EXISTS users (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		)`;

	// create tokens table
	const createTokensTable = `
		CREATE TABLE IF NOT EXISTS tokens (
			id INT AUTO_INCREMENT PRIMARY KEY,
			user_id INT NOT NULL,
			token VARCHAR(255) NOT NULL,
			expires_at DATETIME,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		)`;

	dbConn.query(createUsersTable, (error, result) => {
		if (error) throw error;
		
		console.log('users table created');

		dbConn.query(createTokensTable, (error) => {
			if (error) throw error;
			
			console.log('tokens table created');
			
			// Close connection after all tables are created!
			dbConn.end(); 
		});

	});
});

module.exports = dbConn;