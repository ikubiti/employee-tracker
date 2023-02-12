// Import the necessary modules.
const Database = require('../lib/database');
const utils = require('./utils');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();


const fileReader = require('./fsUtils');
const { printTable } = require('console-table-printer');
const showTable = require('console.table');

const chalk = require('chalk');
const figlet = require('figlet');
const { log } = require('console');

let dbConnection = null;
let result;


// Run the application
const init = async () => {
	utils.clearConsole();

	utils.showBlue('Main Menu');
	result = await prompt(utils.getUserRequest()).then((answer) => answer.option);
	utils.showGreen(result[1]);

	switch (result[0]) {
		case 'viewEmployees':
			result = await dbConnection.getEmployees();
			console.table(result);
			break;

		case 'addEmployees':

			break;

		case 'updateRole':

			break;

		case 'updateManager':

			break;

		case 'summaryManager':
			result = await dbConnection.summaryByManager();
			console.table(result);
			break;

		case 'employeeManager':

			break;

		case 'summaryDepartment':
			result = await dbConnection.summaryByDepartment();
			console.table(result);
			break;

		case 'employeeDepartment':

			break;

		case 'deleteEmployee':

			break;

		case 'viewRoles':
			result = await dbConnection.getRoles();
			console.table(result);
			break;

		case 'addRole':

			break;

		case 'updateSalary':

			break;

		case 'deleteRole':

			break;

		case 'viewDepartments':
			result = await dbConnection.getDepartments();
			console.table(result);
			break;

		case 'addDepartment':

			break;

		case 'deleteDepartment':

			break;

		case 'utilizedBudget':
			result = await dbConnection.getUtilizedBudget();
			console.table(result);
			break;

		// Exit the application
		default:
			return;
	}

	result = await prompt(utils.pauseApplication()).then((answer) => answer.option);
	return await init();
};

// Guide the user through the team creation process
async function runApp() {
	dbConnection = await new Database(true);
	// Run the application
	utils.showYellow('Employee Tracker');
	await utils.waitUser(2);
	await init();
	utils.showRed('GOODBYE...');
}



module.exports = runApp;
