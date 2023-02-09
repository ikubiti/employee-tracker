// Import the necessary modules.
const Database = require('./lib/database');
const fileReader = require('./src/fsUtils');
const { printTable } = require('console-table-printer');

let getConnect = async () => {
	// console.log('Constructing...');
	db = await new Database();
	// console.log('Done:', db);
};

let test = async () => {
	let result = await db.getDepartments();
	printTable(result);
	let result2 = await db.getEmployees();
	printTable(result2);
};

const main = async () => {
	await test();
};

(async () => {
	fileReader.clearConsole();
	await getConnect();
	await main();


	process.exit(0);
})();
