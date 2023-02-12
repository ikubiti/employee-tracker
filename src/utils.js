
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
		width: 200,
		whitespaceBreak: true
	},
	{
		horizontalLayout: 'fitted',
		width: 100,
		whitespaceBreak: true
	}
];

// For easy comparison
const appPrompt = {
	viewEmployees: 'View All Employees',
	addEmployees: 'Add a new Employee',
	updateRole: 'Update Employee Role',
	updateManager: 'Update Employee Manager',
	summaryManager: 'View Summary of Employees Under Each Manager',
	employeeManager: 'View Employees by Manager',
	summaryDepartment: 'View Summary of Employees Under Each Department',
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


	// editMember: fontYellow('Edit an existing Team Member?'),

	// editMember: fontYellow('Edit an existing Team Member?'),
	// finishTeam: fontYellow('Finish Team Building?'),
	// inputValidation: fontRed('Please provide a valid input'),
	// idValidation: fontRed('Please provide a different "Id number", current Id number already in use'),
	// emailValidation: fontRed('Please provide a valid email!!!'),
	// validMember: fontBlue('New Team Member Successfully Created!\n'),
	// impossible: fontRed('HOW DID WE GET HERE!!!'),
	// editPrompt: fontYellow('Select the members you wish to edit or update:'),
	// editMembers: fontYellow('Choose the properties you wish to edit:'),
	// noMembers: fontRed('\nPlease add members to your team first!!!\n'),
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

const displayCyan = (text) => {
	log(chalk.cyan(text));
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
			message: displayCyan('What would you like to do?'),
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

const pauseApplication = () => {
	return [
		{
			type: 'input',
			name: 'key',
			message: displayCyan('Press any key to continue...'),
			waitUserInput: true,
		}
	];
};





module.exports = {
	clearConsole,
	showRed,
	showYellow,
	showGreen,
	showBlue,
	waitUser,
	displayBlue,
	displayCyan,
	displayGreen,
	displayRed,
	getUserRequest,
	pauseApplication
};
