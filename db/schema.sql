DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30) NOT NULL DEFAULT 'Department name'
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(40) NOT NULL DEFAULT 'title',
  department_id INT,
  salary DECIMAL NOT NULL DEFAULT 0.0,
  alias VARCHAR(30),
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL DEFAULT 'first_name',
    last_name VARCHAR(30) NOT NULL DEFAULT 'last_name',
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);
