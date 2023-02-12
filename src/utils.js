
const { printTable } = require('console-table-printer');
const showTable = require('console.table');

const chalk = require('chalk');
const figlet = require('figlet');
const { log } = require('console');
const timer = require("timers/promises");
const inquirer = require('inquirer');

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
	updateRole: 'Update an Employee Role',
	updateManager: 'Update an Employee Manager',
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
	exitApp: 'Exit Application',
};



const mainTable = [
	new inquirer.Separator(' = Department Options = '),
	appPrompt.viewDepartments,
	appPrompt.addDepartment,
	appPrompt.deleteDepartment,
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

const clearConsole = () => {
	console.clear();
	// Clears the console buffer
	console.log("\x1b[3J");
};

const displayBlue = (text) => {
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
	log(chalk.green(text));
};

const displayRed = (text) => {
	log(chalk.red(text));
};


const showRed = (text) => {
	clearConsole();
	log(chalk.bold.red(figlet.textSync(text, figOptions[1])));
};

const showYellow = (text) => {
	clearConsole();
	log(chalk.bold.yellow(figlet.textSync(text, figOptions[0])));
};

const showGreen = (text) => {
	clearConsole();
	log(chalk.bold.green(figlet.textSync(text, figOptions[0])));
};

const showBlue = (text) => {
	clearConsole();
	log(chalk.bold.blue(figlet.textSync(text, figOptions[0])));
};


// Pause the application for a specified amount of time
const waitUser = async (time) => {
	await timer.setTimeout(time * 1000);
};


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

const addEmployee = (roles, employees) => {
	let allRoles = getArray(roles, 'Job Title');
	let allEmployees = getArray(employees, 'Employees');

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


const pauseApplication = () => {
	log();
	return [
		{
			type: 'input',
			name: 'key',
			message: textBlue('\tPress "ENTER" key to continue...'),
			waitUserInput: true,
		}
	];
};

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
	viewEmployeesByDepartment
};
