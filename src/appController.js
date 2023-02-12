// Import the necessary modules.
const Database = require('../lib/database');
const utils = require('./utils');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
// const { printTable } = require('console-table-printer');
const showTable = require('console.table');

// const chalk = require('chalk');
// const figlet = require('figlet');
// const { log } = require('console');

// The database connection object
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
			await addEmployee(response[1]);
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
			await addRole(response[1]);
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
	utils.displayRed(`The department "${newDepartment.name}" already exists, please try another name!`);
	await pauseApplication();
	utils.showBlue(banner);
	return await addDepartment(banner);
};

const addRole = async (banner) => {
	const departments = await dbConnection.getDepartments();
	result = await prompt(utils.addRole(departments)).then((answer) => answer);
	let newRole = {
		title: result.title,
		salary: result.salary,
		department: result.department
	};
	result = await dbConnection.addRole(newRole);
	utils.showBlue(banner);
	if (result) {
		utils.displayGreen(`${newRole.title} Successfully Added`);
		return;
	}

	// Job Title name already exists
	utils.displayRed(`The job title "${newRole.title}" already exists, please try another name!`);
	await pauseApplication();
	utils.showBlue(banner);
	return await addRole(banner);
};

const addEmployee = async (banner) => {
	const roles = await dbConnection.getRoles();
	const employees = await dbConnection.getValidEmployees();
	result = await prompt(utils.addEmployee(roles, employees)).then((answer) => answer);
	let newEmployee = {
		firstName: result.firstName,
		lastName: result.lastName,
		role: result.role,
		manager: result.manager
	};
	result = await dbConnection.addEmployee(newEmployee);
	utils.showBlue(banner);
	if (result) {
		utils.displayGreen(`${newEmployee.firstName} ${newEmployee.lastName} Successfully Added`);
		return;
	}

	// Department name already exists
	utils.displayRed(`An employee with the name "${newEmployee.firstName} ${newEmployee.lastName}" already exists, please try another name!`);
	await pauseApplication();
	utils.showBlue(banner);
	return await addDepartment(banner);
};

// Allow the user to read the application feedback
const pauseApplication = async () => {
	return await prompt(utils.pauseApplication()).then((answer) => answer.option);
}


// Guide the user through the team creation process
const runApp = async () => {
	dbConnection = await new Database();
	// Run the application
	utils.showYellow('Employee Tracker');
	await utils.waitUser(2);
	await init();
	utils.showRed('GOODBYE...');
}



module.exports = runApp;
