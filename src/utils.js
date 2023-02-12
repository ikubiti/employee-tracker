// Import the necessary modules.
const inquirer = require('inquirer');
const showTable = require('console.table');
const chalk = require('chalk');
const figlet = require('figlet');
const { log } = require('console');
const timer = require("timers/promises");

const figOptions = [
	{
		horizontalLayout: 'full',
		verticalLayout: 'full',
		width: 200,
		whitespaceBreak: true
	},
	{
		horizontalLayout: 'fitted',
		verticalLayout: 'full',
		width: 100,
		whitespaceBreak: true
	}
];

// For easy comparison
const appPrompt = {
	viewEmployees: 'View All Employees',
	addEmployees: 'Add a new Employee',
	updateRole: "Update an Employee's Role",
	updateManager: "Update an Employee's Manager",
	summaryManager: 'View the Summary of Employees Under Each Manager',
	employeeManager: 'View Employees by Manager',
	summaryDepartment: 'View the Summary of Employees Under Each Department',
	employeeDepartment: 'View Employees by Department',
	deleteEmployee: 'Delete an Employee',
	viewRoles: 'View All Roles',
	addRole: 'Add a new Role',
	updateSalary: 'Update any Role Salary',
	deleteRole: 'Delete a Role',
	viewDepartments: 'View All Departments',
	addDepartment: 'Add a new Department',
	deleteDepartment: 'Delete a Department',
	utilizedBudget: 'View Utilized Budget',
	utilizedDepartment: 'View Utilized Budget by Department',
	exitApp: 'Exit Application',
};

// Application main menu
const mainTable = [
	new inquirer.Separator(' = Department Options = '),
	appPrompt.viewDepartments,
	appPrompt.addDepartment,
	appPrompt.deleteDepartment,
	appPrompt.utilizedDepartment,
	appPrompt.utilizedBudget,
	new inquirer.Separator(' = Role Options = '),
	appPrompt.viewRoles,
	appPrompt.addRole,
	appPrompt.updateSalary,
	appPrompt.deleteRole,
	new inquirer.Separator(' = Employee Options = '),
	appPrompt.addEmployees,
	appPrompt.viewEmployees,
	appPrompt.updateRole,
	appPrompt.updateManager,
	appPrompt.summaryManager,
	appPrompt.summaryDepartment,
	appPrompt.employeeManager,
	appPrompt.employeeDepartment,
	appPrompt.deleteEmployee,
	new inquirer.Separator(' = Exit Options = '),
	appPrompt.exitApp,
];

// Reset the console
const clearConsole = () => {
	console.clear();
	// Clears the console buffer
	console.log("\x1b[3J");
};

// Display texts in custom colors
const displayBlue = (text) => {
	newLine();
	log(chalk.blue(text));
};

const textBlue = (text) => {
	return chalk.blue(text);
};

const textMagenta = (text) => {
	return chalk.magenta(text);
};

const textCustom = (text) => {
	return chalk.blueBright(text);
};

const textRed = (text) => {
	return chalk.red(text);
};

const displayGreen = (text) => {
	newLine();
	log(chalk.green(text));
};

const displayRed = (text) => {
	newLine();
	log(chalk.red(text));
};


const showRed = (text) => {
	clearConsole();
	log(chalk.bold.red(figlet.textSync(text, figOptions[1])));
	newLine();
};

const showYellow = (text) => {
	clearConsole();
	log(chalk.bold.yellow(figlet.textSync(text, figOptions[0])));
	newLine();
};

const showGreen = (text) => {
	clearConsole();
	log(chalk.bold.green(figlet.textSync(text, figOptions[0])));
	newLine();
};

const showBlue = (text) => {
	clearConsole();
	log(chalk.bold.blue(figlet.textSync(text, figOptions[0])));
	newLine();
};

// Pause the application for a specified amount of time
const waitUser = async (time) => {
	await timer.setTimeout(time * 1000);
};


// Prompts to get the user choice in the main menu
const getUserRequest = () => {
	return [
		{
			type: 'list',
			name: 'option',
			message: textMagenta('What would you like to do?'),
			pageSize: 25,
			choices: mainTable,
			filter: (val) => {
				for (let value in appPrompt) {
					if (appPrompt[value] === val) {
						return [value, val];
					}
				}
			},
			waitUserInput: true,
		}
	];
};

// Prompts to add a new department
const addDepartment = () => {
	return [
		{
			type: 'input',
			name: 'department',
			message: textCustom('What is the name of the new department?'),
			validate: checkInput
		}
	];
};

// Prompts to add a new role
const addRole = (departments) => {
	let allDepartments = getArray(departments, 'Department_Name');
	const questions = [
		{
			type: 'input',
			name: 'title',
			message: textCustom('What is the name of the new role?'),
			validate: checkInput,
			waitUserInput: true,
		},
		{
			type: 'input',
			name: 'salary',
			message: textCustom('What is the annual salary of the role?'),
			validate: checkNumber,
			filter: filterInput,
			waitUserInput: true,
		},
		{
			type: 'list',
			name: 'department',
			message: textCustom('Which department does this role belong to?'),
			pageSize: 20,
			choices: allDepartments,
			waitUserInput: true,
		}
	];

	return questions;
};

// Prompts to add a new employee
const addEmployee = (roles, employees) => {
	let allRoles = getArray(roles, 'Job Title');
	let allEmployees = getArray(employees, 'Employees');
	// add None to managers
	allEmployees.unshift('None');

	const questions = [
		{
			type: 'input',
			name: 'firstName',
			message: textCustom("What is the employee's first name?"),
			validate: checkInput,
			waitUserInput: true,
		},
		{
			type: 'input',
			name: 'lastName',
			message: textCustom("What is the employee's last name?"),
			validate: checkInput,
			waitUserInput: true,
		},
		{
			type: 'list',
			name: 'role',
			message: textCustom("What is the employee's role?"),
			pageSize: 25,
			choices: allRoles,
			waitUserInput: true,
		},
		{
			type: 'list',
			name: 'manager',
			message: textCustom("Who is the employee's manager?"),
			pageSize: 25,
			choices: allEmployees,
			waitUserInput: true,
		}
	];

	return questions;
};

// Prompts to delete a department
const deleteDepartment = (departments) => {
	let allDepartments = getArray(departments, 'Department_Name');
	const questions = [
		{
			type: 'list',
			name: 'department',
			message: textCustom('Select the Department to delete?'),
			pageSize: 20,
			choices: allDepartments,
			waitUserInput: true,
		}
	];

	return questions;

};

// Prompts to delete a role
const deleteRole = (roles) => {
	let allRoles = getArray(roles, 'Job Title');
	const questions = [
		{
			type: 'list',
			name: 'role',
			message: textCustom('Select the Role to delete?'),
			pageSize: 20,
			choices: allRoles,
			waitUserInput: true,
		}
	];

	return questions;
};


// Prompts to delete an employee
const deleteEmployee = (employees) => {
	let allEmployees = getArray(employees, 'Employees');
	const questions = [
		{
			type: 'list',
			name: 'employee',
			message: textCustom('Select the Employee to delete?'),
			pageSize: 20,
			choices: allEmployees,
			waitUserInput: true,
		}
	];

	return questions;
};

// Prompts to view all employees by manager
const viewEmployeesByManager = (employees) => {
	let allManagers = getArray(employees, 'Managers');
	const questions = [
		{
			type: 'list',
			name: 'manager',
			message: textCustom("Select the Manager's employee to view?"),
			pageSize: 20,
			choices: allManagers,
			waitUserInput: true,
		}
	];

	return questions;
};


// Prompts to view all employees by department
const viewEmployeesByDepartment = (departments) => {
	let allDepartments = getArray(departments, 'Department_Name');
	const questions = [
		{
			type: 'list',
			name: 'department',
			message: textCustom("Select the Department's employees to view?"),
			pageSize: 20,
			choices: allDepartments,
			waitUserInput: true,
		}
	];

	return questions;

};

// Prompts to view utilized budget by department
const viewUtilizedByDepartment = (departments) => {
	let allDepartments = getArray(departments, 'Department_Name');
	const questions = [
		{
			type: 'list',
			name: 'department',
			message: textCustom("Select the Department to view its Utilized Budget!"),
			pageSize: 20,
			choices: allDepartments,
			waitUserInput: true,
		}
	];

	return questions;

};

// Prompts to update an employee's role
const updateEmployeeRole = (roles, employees) => {
	let allRoles = getArray(roles, 'Job Title');
	let allEmployees = getArray(employees, 'Employees');

	const questions = [
		{
			type: 'list',
			name: 'name',
			message: textCustom("Select Employee to update their role!"),
			pageSize: 25,
			choices: allEmployees,
			waitUserInput: true,
		},
		{
			type: 'list',
			name: 'role',
			message: textCustom("Select the Employee's new role!"),
			pageSize: 25,
			choices: allRoles,
			waitUserInput: true,
		}
	];

	return questions;
};

// Prompts to update an employee's manager
const updateEmployeeManager = (employees, managers) => {
	let allEmployees = getArray(employees, 'Employees');
	let allManagers = getArray(managers, 'Employees');
	// add None to managers
	allManagers.unshift('None');

	const questions = [
		{
			type: 'list',
			name: 'name',
			message: textCustom("Select the Employee you want to change their manager!"),
			pageSize: 25,
			choices: allEmployees,
			filter: (val) => {
				// Remove selected employee from list
				if (allManagers.includes(val)) {
					allManagers.splice(allManagers.indexOf(val), 1);
				}
				return val;
			},
			waitUserInput: true,
		},
		{
			type: 'list',
			name: 'manager',
			message: textCustom("Select Employee's new manager!"),
			pageSize: 25,
			choices: allManagers,
			waitUserInput: true,
		}
	];

	return questions;
};

// Prompts to update the salary of any role
const updateRoleSalary = (roles) => {
	let allRoles = getArray(roles, 'Job Title');
	const questions = [
		{
			type: 'list',
			name: 'title',
			message: textCustom("Select the Role to update its salary!"),
			pageSize: 25,
			choices: allRoles,
			waitUserInput: true,
		},
		{
			type: 'input',
			name: 'salary',
			message: textCustom('What is the new salary of the role?'),
			validate: checkNumber,
			filter: filterInput,
			waitUserInput: true,
		},
	];

	return questions;
}

// Pause the application until the user is ready to proceed
const pauseApplication = () => {
	newLine();
	return [
		{
			type: 'input',
			name: 'key',
			message: textBlue('\tPress "ENTER" key to continue...'),
			waitUserInput: true,
		}
	];
};

const newLine = () => log();

// check for empty inputs
const checkInput = (value) => {
	let val = value;
	if (value instanceof Array) {
		val = value.join(', ');
	}

	if (val.trim() || val.trim().length > 0) {
		return true;
	}

	return textRed('Please provide a valid input!!!');
};

// Filter input for valid numbers;
const filterInput = (value) => {
	let val = parseInt(value);
	if (val) {
		return val;
	}

	return '';
};

// validates number inputs
const checkNumber = (value) => {
	if (typeof value === 'number') {
		return true;
	}

	return textRed('Please provide a valid Salary value!!!');
};

// Generates an array from an object
const getArray = (tableData, target) => {
	let ans = [];
	tableData.forEach(element => {
		ans.push(element[target]);
	});

	return ans;
}


module.exports = {
	clearConsole,
	showRed,
	showYellow,
	showGreen,
	showBlue,
	waitUser,
	displayBlue,
	displayGreen,
	displayRed,
	getUserRequest,
	pauseApplication,
	addDepartment,
	addRole,
	addEmployee,
	deleteDepartment,
	deleteRole,
	deleteEmployee,
	viewEmployeesByManager,
	viewEmployeesByDepartment,
	viewUtilizedByDepartment,
	updateEmployeeRole,
	updateEmployeeManager,
	updateRoleSalary
};
