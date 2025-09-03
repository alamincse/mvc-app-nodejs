require('module-alias/register'); // load module alias register

const createUsersTable = require('@database/migrations/create_users_table');
const createTokensTable = require('@database/migrations/create_tokens_table');

async function migrate() {
	try {
		await createUsersTable();
		await createTokensTable();

		console.log('All tables created!');

		process.exit(); // exit after all migrations run
	} catch (error) {
		console.error('Migration failed:', error.message);
		
		process.exit(1);
	}
}

migrate();
