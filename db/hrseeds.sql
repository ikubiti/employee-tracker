INSERT INTO departments (dept_name)
VALUES  ("Human Resources");

INSERT INTO roles (title, salary, department_id, alias)
VALUES  ("Director of Human Resources", 150000.00, 8, "HR Director"),
        ("Office Manager", 90000.00, 8, "Admin Manager");


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Linda", "Jones", 8, 1),
        ("Marie", "Lee", 23, 8);