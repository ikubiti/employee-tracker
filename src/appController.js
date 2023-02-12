// Import the necessary modules.
const Database = require('../lib/database');
const utils = require('./utils');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();

// The database connection object
let dbConnection = null;
let result;

// Run the application
const init = async () => {
	utils.clearConsole();
	utils.showBlue('-Main Menu-');

	const response = await prompt(utils.getUserRequest()).then((answer) => answer.option);
	utils.showGreen(response[1]);

	// Process the user's response
	switch (response[0]) {
		case 'viewEmployees':
			result = await dbConnection.getEmployees();
			console.table(result);
			break;

		case 'addEmployees':
			await addEmployee(response[1]);
			break;

		case 'updateRole':
			await updateEmployeeRole(response[1]);
			break;

		case 'updateManager':
			await updateEmployeeManager(response[1]);
			break;

		case 'summaryManager':
			result = await dbConnection.summaryByManager();
			console.table(result);
			break;

		case 'employeeManager':
			await viewEmployeesByManager(response[1]);
			break;

		case 'summaryDepartment':
			result = await dbConnection.summaryByDepartment();
			console.table(result);
			break;

		case 'employeeDepartment':
			await viewEmployeesByDepartment(response[1]);
			break;

		case 'deleteEmployee':
			await deleteEmployee();
			break;

		case 'viewRoles':
			result = await dbConnection.getRoles();
			console.table(result);
			break;

		case 'addRole':
			await addRole(response[1]);
			break;

		case 'updateSalary':
			await updateRoleSalary(response[1])
			break;

		case 'deleteRole':
			await deleteRole();
			break;

		case 'viewDepartments':
			result = await dbConnection.getDepartments();
			console.table(result);
			break;

		case 'addDepartment':
			await addDepartment(response[1]);
			break;

		case 'deleteDepartment':
			await deleteDepartment();
			break;

		case 'utilizedDepartment':
			await viewUtilizedByDepartment(response[1]);
			break;

		case 'utilizedBudget':
			result = await dbConnection.getUtilizedBudget();
			console.table(result);
			break;

		// Close the database connection and exit the application
		default:
			utils.showBlue('... closing database connection');
			await dbConnection.closeConnection();
			await utils.waitUser(1.5);
			return;
	}

	await pauseApplication();
	return await init();
};

// Prompts to add a new department
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

// Prompts to add a new role
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

// Prompts to add a new employee
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
	return await addEmployee(banner);
};

// Prompts to delete a department
const deleteDepartment = async () => {
	const departments = await dbConnection.getDepartments();
	const { department } = await prompt(utils.deleteDepartment(departments)).then((answer) => answer);
	result = await dbConnection.deleteDepartment(department);
	if (result === 2) {
		utils.displayGreen(`${department} Successfully Deleted`);
		return;
	}

	utils.displayRed(`An inexplicable error occurred while deleting "${department}.\nThe Application will shut down to avoid corrupting the database!`);
	await pauseApplication();
	process.exit();
};

// Prompts to delete a role
const deleteRole = async () => {
	const roles = await dbConnection.getRoles();
	const { role } = await prompt(utils.deleteRole(roles)).then((answer) => answer);
	result = await dbConnection.deleteRole(role);
	if (result === 2) {
		utils.displayGreen(`${role} Successfully Deleted`);
		return;
	}

	utils.displayRed(`An inexplicable error occurred while deleting "${role}.\nThe Application will shut down to avoid corrupting the database!`);
	await pauseApplication();
	process.exit();
};

// Prompts to delete an employee
const deleteEmployee = async () => {
	const employees = await dbConnection.getFullNames();
	const { employee } = await prompt(utils.deleteEmployee(employees)).then((answer) => answer);
	result = await dbConnection.deleteEmployee(employee);
	if (result === 2) {
		utils.displayGreen(`${employee} Successfully Deleted`);
		return;
	}

	utils.displayRed(`An inexplicable error occurred while deleting "${employee}.\nThe Application will shut down to avoid corrupting the database!`);
	await pauseApplication();
	process.exit();
};

// Prompts to view all employees by manager
const viewEmployeesByManager = async (banner) => {
	const managers = await dbConnection.getAllManagers();
	const { manager } = await prompt(utils.viewEmployeesByManager(managers)).then((answer) => answer);
	result = await dbConnection.getEmployeesByManager(manager);
	utils.showBlue(banner);
	console.table(result);
};

// Prompts to view all employees by department
const viewEmployeesByDepartment = async (banner) => {
	const departments = await dbConnection.getDepartments();
	const { department } = await prompt(utils.viewEmployeesByDepartment(departments)).then((answer) => answer);
	result = await dbConnection.getEmployeesByDepartment(department);
	utils.showBlue(banner);
	console.table(result);
};


// Prompts to view utilized budget by department
const viewUtilizedByDepartment = async (banner) => {
	const departments = await dbConnection.getDepartments();
	const { department } = await prompt(utils.viewUtilizedByDepartment(departments)).then((answer) => answer);
	result = await dbConnection.getDepartmentBudget(department);
	utils.showBlue(banner);
	console.table(result);
};

// Prompts to update an employee's role
const updateEmployeeRole = async (banner) => {
	const employees = await dbConnection.getFullNames();
	const roles = await dbConnection.getRoles();
	result = await prompt(utils.updateEmployeeRole(roles, employees)).then((answer) => answer);
	await dbConnection.updateEmployeeRole(result);
	utils.showBlue(banner);
	utils.displayGreen(`The role of ${result.name} was successfully updated!`);
};

// Prompts to update an employee's manager
const updateEmployeeManager = async (banner) => {
	const employees = await dbConnection.getFullNames();
	const managers = await dbConnection.getValidEmployees();

	result = await prompt(utils.updateEmployeeManager(employees, managers)).then((answer) => answer);
	await dbConnection.updateManager(result);
	utils.showBlue(banner);
	utils.displayGreen(`The manager of ${result.name} was successfully updated!`);
};

// Prompts to update the salary of any role
const updateRoleSalary = async (banner) => {
	const roles = await dbConnection.getRoles();
	result = await prompt(utils.updateRoleSalary(roles)).then((answer) => answer);
	await dbConnection.updateRoleSalary(result);
	utils.showBlue(banner);
	utils.displayGreen(`The salary of ${result.title} was successfully updated!`);
};

// Allow the user to read the application feedback
const pauseApplication = async () => {
	return await prompt(utils.pauseApplication()).then((answer) => answer.option);
}


// Guide the user through the team creation process
const runApp = async () => {
	dbConnection = await new Database();
	// Run the application
	utils.showYellow(' Employee Tracker');
	utils.displayGreen('\tInitializing the application...\n');
	await utils.waitUser(1.5);
	await init();
	utils.showRed('GOODBYE...');
}



module.exports = runApp;
