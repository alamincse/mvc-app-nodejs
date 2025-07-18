const db = require('../../config/db');

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

module.exports = () => {
	return new Promise((resolve, reject) => {
		db.query(createTokensTable, (error, result) => {
			if (error) return reject(error);

			console.log('tokens table created');
			
			resolve();
		});
	});
};
