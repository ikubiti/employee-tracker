// Import and require mysql2
const mysql = require('mysql2/promise');
const fileReader = require('../src/fsUtils');

// Database Level Configuration
const dbConfig = {
	host: 'localhost',
	user: 'root',
	password: 'Passw0rd!',
	database: 'company_db',
};

// mySQL Level Configuration
const mysqlConfig = {
	host: 'localhost',
	user: 'root',
	password: 'Passw0rd!',
};


// let db;
let count = 0;

class Database {
	constructor() {
		return (async () => {
			await getConnection();
			return this;
		})();
	}
}


Database.prototype.getDepartments = async () => {
	const [rows] = await this.db.query('SELECT * FROM departments');
	return rows;
};


Database.prototype.getEmployees = async () => {
	const [rows] = await this.db.query('SELECT * FROM employee');
	return rows;
};

// Attempt to connect to the database
const getConnection = async () => {
	try {
		this.db = await mysql.createConnection(dbConfig);
		console.log('Database Connected - count: ', count++);
	} catch (err) {
		if (err.code === 'ER_BAD_DB_ERROR') {
			await createDatabase();
		} else {
			console.log('Application exited with error: ', err.code);
			process.exit(1);
		}
	}
};

// Create and seed the database if it doesn't exist
const createDatabase = async () => {
	// Reconnect to mySQL server at top level
	this.db = await mysql.createConnection(mysqlConfig);
	// Create the database
	await runSQLFile('db', 'schema.sql');
	// seed the database
	await runSQLFile('db', 'seeds.sql');
};

const runSQLFile = async (directory, file) => {
	let sqlFile = await fileReader.readFromFile(directory, file);
	let sqlStatements = sqlFile.split(';');

	// Create the database
	sqlStatements.forEach(async line => {
		let aline = line.trim();
		if (aline) await this.db.query(aline);
	});
};







module.exports = Database;