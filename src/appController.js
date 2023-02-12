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

	const response = await prompt(utils.getUserRequest()).then((answer) => answer.option);
	utils.showGreen(response[1]);

	switch (response[0]) {
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
			await addDepartment(response[1]);
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

	await pauseApplication();
	return await init();
};

const addDepartment = async (banner) => {
	result = await prompt(utils.addDepartment()).then((answer) => answer.department);
	let newDepartment = { name: result };
	result = await dbConnection.addDepartment(newDepartment);
	utils.showBlue(banner);
	if (result) {
		utils.displayGreen(`${newDepartment.name} Successfully Added`);
		return;
	}

	// Department name already exists
	utils.displayRed(`${newDepartment.name} already exists, please try another name!`);
	await pauseApplication();
	utils.showBlue(banner);
	return await addDepartment(banner);
};

const pauseApplication = async () => {
	return await prompt(utils.pauseApplication()).then((answer) => answer.option);
}


// Guide the user through the team creation process
const runApp = async () => {
	dbConnection = await new Database(true);
	// Run the application
	utils.showYellow('Employee Tracker');
	await utils.waitUser(2);
	await init();
	utils.showRed('GOODBYE...');
}



module.exports = runApp;
