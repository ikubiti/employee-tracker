// Import and require mysql2
const mysql = require('mysql2/promise');
const constructDatabase = require('../src/createDb');

// Database Level Configuration
const dbConfig = {
	host: 'localhost',
	user: 'root',
	password: 'Passw0rd!',
	database: 'company_db',
};

// let db;
let count = 0;

// Prefer Constructor function over class method
function Database(flag = false) {
	return (async () => {
		await init(flag);
		return this;
	})();
}

// Get to view all Departments
Database.prototype.getDepartments = async () => {
	const [rows] = await this.db.query('SELECT id AS ID, dept_name AS Department_Name FROM departments');
	return rows;
};

// Get to view all employees
Database.prototype.getEmployees = async () => {
	const theQuery = 'SELECT staff.id AS "Employee ID", staff.first_name AS "First Name", staff.last_name  AS "Last Name", IFNULL(roles.title, "NONE") AS "Job Title", IFNULL(departments.dept_name, "UNASSIGNED") AS Department, IFNULL(roles.salary, 0.0) AS Salary, staff.Manager FROM(SELECT A.id, A.first_name, A.last_name, A.role_id, CONCAT_WS(" ", B.first_name, B.last_name) AS Manager FROM employee A LEFT JOIN employee B ON(A.manager_id = B.id)) AS staff LEFT JOIN(roles, departments) ON(staff.role_id = roles.id AND roles.department_id = departments.id)';
	const [rows] = await this.db.query(theQuery);
	return rows;
};

// Get to view all Roles
Database.prototype.getRoles = async () => {
	const theQuery = 'SELECT roles.id AS ID, title AS "Job Title", departments.dept_name AS Department, salary AS Salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id;';
	const [rows] = await this.db.query(theQuery);
	return rows;
};


// Add a new employee, no duplicates allowed
Database.prototype.addEmployee = async (employee) => {
	let allNames = `(SELECT id, CONCAT_WS(" ", first_name, last_name) AS fullName FROM employee) AS AllNames`;
	let compare = "AllNames.fullName";
	let target = `${employee.firstName} ${employee.lastName}`;

	if (await isDuplicateName(allNames, compare, target)) {
		return 0;
	}

	let managerId = "NULL";
	if (employee.manager !== 'None') {
		managerId = await getAttributeId("employee", 'CONCAT_WS(" ", first_name, last_name)', employee.manager);
	}

	const roleId = await getAttributeId('roles', 'roles.title', employee.role);
	let theQuery = `INSERT INTO employee (employee.first_name, last_name, role_id, manager_id) VALUES("${employee.firstName}", "${employee.lastName}", ${roleId}, ${managerId});`;

	const [rows] = await this.db.query(theQuery);
	return rows.insertId;

};

// Add new role with no duplicates allowed
Database.prototype.addRole = async (role) => {
	if (await isDuplicateName('roles', 'roles.title', `${role.title}`)) {
		return 0;
	}

	const departmentId = await getAttributeId("departments", "departments.dept_name", role.department);

	const theQuery = `INSERT INTO roles (title, salary, department_id, alias) VALUES ("${role.title}", ${role.salary}, ${departmentId}, "${role.title}");`;

	const [rows] = await this.db.query(theQuery);
	return rows.insertId;
};

// Add new department with no duplicates allowed
Database.prototype.addDepartment = async (department) => {
	if (await isDuplicateName('departments', 'departments.dept_name', `${department.name}`)) {
		return 0;
	}

	const theQuery = `INSERT INTO departments (dept_name) VALUES ("${department.name}");`;

	const [rows] = await this.db.query(theQuery);
	return rows.insertId;
};

// Update the employee's role
Database.prototype.updateEmployeeRole = async (employee) => {
	let roleId = await getAttributeId('roles', 'roles.title', employee.role);
	const theQuery = `UPDATE employee SET role_id = ${roleId} WHERE CONCAT_WS(" ", first_name, last_name) = "${employee.name}";`;

	const [rows] = await this.db.query(theQuery);
	return rows.info.split(" ")[5];
};

// Update the employee's manager
Database.prototype.updateManager = async (employee) => {
	let managerId = await getAttributeId("employee", 'CONCAT_WS(" ", first_name, last_name)', employee.manager);
	const theQuery = `UPDATE employee SET manager_id = ${managerId} WHERE CONCAT_WS(" ", first_name, last_name) = "${employee.name}";`;

	const [rows] = await this.db.query(theQuery);
	return rows.info.split(" ")[5];
};

// Update the salary of any role
Database.prototype.updateRoleSalary = async (role) => {
	let roleId = await getAttributeId("roles", 'roles.title', role.title);
	const theQuery = `UPDATE roles SET salary = ${role.salary} WHERE id = "${roleId}";`;

	const [rows] = await this.db.query(theQuery);
	return rows.info.split(" ")[5];
}

// Get employee names
Database.prototype.getFullNames = async () => {
	return await getNames();
};

// Get the names of all managers
Database.prototype.getAllManagers = async () => {
	const theQuery = 'SELECT DISTINCT CONCAT_WS(" ", B.first_name, B.last_name) AS Managers FROM employee AS A LEFT JOIN employee AS B ON (A.manager_id = B.id) WHERE B.first_name <> ""; ';
	const [rows] = await this.db.query(theQuery);
	return rows;
};

// View all employees by manager
Database.prototype.getEmployeesByManager = async (managerName) => {
	const theQuery = `SELECT employee.id AS "Employee ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", roles.title AS "Job Title", departments.dept_name AS Department FROM(SELECT id FROM employee WHERE CONCAT_WS(" ", first_name, last_name) = "${managerName}") AS Manager LEFT JOIN(employee, roles, departments) ON employee.manager_id = Manager.id AND employee.role_id = roles.id AND roles.department_id = departments.id WHERE roles.title <> "NULL";`;
	const [rows] = await this.db.query(theQuery);
	return rows;
};

// Get a summary employees under each manager
Database.prototype.summaryByManager = async () => {
	const theQuery = `SELECT CONCAT_WS(" ", B.first_name, B.last_name) AS Manager, COUNT(A.id) AS "Employee Count" FROM employee A LEFT JOIN employee B ON (A.manager_id = B.id) WHERE B.first_name <> "" GROUP BY Manager;`;
	const [rows] = await this.db.query(theQuery);
	return rows;
};

// View all employees by department
Database.prototype.getEmployeesByDepartment = async (departmentName) => {
	const theQuery = `SELECT employee.id AS "Employee ID", CONCAT_WS(" ", employee.first_name, employee.last_name) AS "Full Name", roles.title AS "Job Title" FROM (SELECT id FROM departments WHERE dept_name = "${departmentName}") AS department LEFT JOIN (employee, roles) ON employee.role_id = roles.id AND roles.department_id = department.id;`;
	const [rows] = await this.db.query(theQuery);
	return rows;
};

// Get a summary employees under each department
Database.prototype.summaryByDepartment = async () => {
	const theQuery = `SELECT IFNULL(departments.dept_name, "UNASSIGNED") AS Department, COUNT(employee.id) AS "Employee Count" FROM employee LEFT JOIN (roles, departments) ON (employee.role_id = roles.id AND roles.department_id = departments.id) GROUP BY Department;`;
	const [rows] = await this.db.query(theQuery);
	return rows;
};

// Delete an employee by Name
Database.prototype.deleteEmployee = async (employeeName) => {
	let employeeId = await getAttributeId("employee", 'CONCAT_WS(" ", first_name, last_name)', employeeName);
	return deleteRow("employee", employeeId);
};

// Delete a role by Name
Database.prototype.deleteRole = async (role) => {
	let roleId = await getAttributeId("roles", 'roles.title', role);
	return deleteRow("roles", roleId);
};

// Delete a department by Name
Database.prototype.deleteDepartment = async (department) => {
	let deptId = await getAttributeId("departments", 'departments.dept_name', department);
	return deleteRow("departments", deptId);
};

// Get the utilized budget of all departments
Database.prototype.getUtilizedBudget = async () => {
	const theQuery = 'SELECT departments.dept_name AS Department, IFNULL(sum(roles.salary), 0) AS "Utilized Budget" FROM departments LEFT JOIN(employee, roles) ON employee.role_id = roles.id AND roles.department_id = departments.id GROUP BY Department; ';
	const [rows] = await this.db.query(theQuery);
	return rows;
};

// Get the utilized budget of all departments
Database.prototype.getDepartmentBudget = async (department) => {
	const theQuery = `SELECT departments.dept_name AS Department, IFNULL(sum(roles.salary), 0) AS "Utilized Budget" FROM departments LEFT JOIN(employee, roles) ON employee.role_id = roles.id AND roles.department_id = departments.id GROUP BY Department HAVING departments.dept_name = "${department}"; `;
	const [rows] = await this.db.query(theQuery);
	return rows;
};

// Gets valid employees for various assignments
Database.prototype.getValidEmployees = async () => {
	return await getAssignedEmployees();
};


/////////////////////////////////////////////////////////////////////////
// Attempt to connect to the database or exit the application
const init = async (flag) => {
	try {
		if (flag) {
			this.db = await constructDatabase();
		} else {
			this.db = await mysql.createConnection(dbConfig);
		}
		console.log('Database Connected - count: ', count++);
	} catch (err) {
		if (err.code === 'ER_BAD_DB_ERROR') {
			this.db = await constructDatabase();
		} else {
			console.log('Application exited with error: ', err.code);
			process.exit(1);
		}
	}
};

// Helper Function to get the id of any field from any table
const getAttributeId = async (tableName, comparator, target) => {
	const theQuery = `SELECT id FROM ${tableName} WHERE ${comparator} = "${target}";`;
	const [rows] = await this.db.query(theQuery);
	return rows[0].id;
};

// Helper function to get employee names
const getNames = async () => {
	const [rows] = await this.db.query('SELECT CONCAT_WS(" ", first_name, last_name) AS Full_Name FROM employee');

	return rows;
};

// Helper function to check if a name is already in the database
const isDuplicateName = async (tableName, comparator, target) => {
	const theQuery = `SELECT id FROM ${tableName} WHERE ${comparator} = "${target}";`;
	const [rows] = await this.db.query(theQuery);
	if (rows.length > 0) {
		return true;
	}

	return false;
};

// Helper function to delete any row in any table from the database
const deleteRow = async (table, rowId) => {
	const theQuery = `DELETE FROM ${table} WHERE id = ${rowId};`;
	const [rows] = await this.db.query(theQuery);
	return rows.serverStatus;
};

// Helper function to filter out all unassigned employees
const getAssignedEmployees = async () => {
	const theQuery = 'SELECT CONCAT_WS(" ", first_name, last_name) AS Employees FROM employee WHERE role_id IS NOT NULL;';
	const [rows] = await this.db.query(theQuery);
	return rows;
};


module.exports = Database;