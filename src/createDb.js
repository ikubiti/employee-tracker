// Import and require mysql2
const mysql = require('mysql2/promise');
const fileReader = require('../src/fsUtils');

let dbConnection;

// mySQL Level Configuration
const mysqlConfig = {
	host: 'localhost',
	user: 'root',
	password: 'Passw0rd!',
};

// Create and seed the database if it doesn't exist
const constructDatabase = async () => {
	// Connect to mySQL server at top level
	dbConnection = await mysql.createConnection(mysqlConfig);
	// Create the database
	await runSQLFile('db', 'schema.sql');
	// seed the database
	await runSQLFile('db', 'seeds.sql');

	return dbConnection;
};

const runSQLFile = async (directory, file) => {
	const sqlFile = await fileReader.readFromFile(directory, file);
	const sqlStatements = sqlFile.split(';');

	// Execute the SQL statements
	sqlStatements.forEach(async line => {
		let aline = line.trim();
		if (aline) await dbConnection.query(aline);
	});
};


module.exports = constructDatabase;
