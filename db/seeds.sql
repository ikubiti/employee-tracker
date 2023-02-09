INSERT INTO departments (dept_name)
VALUES  ("Executive Office"),
        ("Operations"),
        ("Finances"),
        ("Marketing"),
        ("Engineering"),
        ("Information Services"),
        ("Sales Services");

INSERT INTO roles (title, salary, department_id, alias)
VALUES  ("Chief Executive Officer", 300000.00, 1, "CEO"),
        ("Chief Operations Officer", 150000.00, 2, "COO"),
        ("Chief Finance Officer", 150000.00, 3, "CFO"),
        ("Vice President of Marketing", 150000.00, 4, "VP of Marketing"),
        ("Vice President of Engineering", 150000.00, 5, "VP of Engineering"),
        ("Vice President of Information Services", 150000.00, 6, "VP of IT"),
        ("Vice President of Sales Services", 150000.00, 7, "VP of Sales"),
        ("Director of Operatons", 130000.00, 2, "Operations Director"),
        ("Director of Production", 130000.00, 2, "Production Director"),
        ("Finance Controller", 130000.00, 3, "Controller"),
        ("Search Marketing Manager", 120000.00, 4, "Search Manager"),
        ("Email Marketing Manager", 120000.00, 4, "Email Manager"),
        ("Web Master", 120000.00, 4, "Web Manager"),
        ("Senior Programmer", 135000.00, 5, "Snr Programmer"),
        ("Programmer", 110000.00, 5, "Developer"),
        ("System Administrator", 100000.00, 6, "System Admin"),
        ("Technical Writer", 100000.00, 6, "Tech Writer"),
        ("Web Content Developer", 90000.00, 6, "Web Content"),
        ("Account Executive", 90000.00, 7, "Chief Account"),
        ("Sales Manager", 85000.00, 7, "Sales Manager"),
        ("Sales Engineer", 80000.00, 7, "Sales Engineer"),
        ("Executive Assistant", 80000.00, 1, "SPACE"),
        ("Senior Producer", 120000.00, 2, "Snr Producer"),
        ("Senior Game Designer", 110000.00, 2, "Snr Designer"),
        ("Game Designer", 90000.00, 2, "Designer"),
        ("Producer", 90000.00, 2, "Producer");


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Ned", "Stark", 1, NULL),
        ("Jon", "Snow", 2, 1),
        ("Brett", "McQuail", 3, 1),
        ("Paul", "Smith", 4, 1),
        ("Jeffrey", "Buson", 5, 1),
        ("Kevin", "Piccolo", 6, 1),
        ("Tony", "James", 7, 1),
        ("Susan", "Parkins", 8, 2),
        ("Rick", "Jarrison", 9, 2),
        ("Dave", "Gillerman", 10, 3),
        ("Dan", "O'Brien", 11, 4),
        ("Jeff", "Jackson", 12, 4),
        ("Mark", "Rommey", 13, 4),
        ("Scott", "Burns", 14, 5),
        ("Eliane", "Cho", 15, 5),
        ("Bob", "Zieger", 15, 5),
        ("Julio", "Sanchez", 15, 5),
        ("Jerry", "Chu", 15, 5),
        ("Rich", "Lord", 15, 5),
        ("Emese", "Gris", 15, 5),
        ("Tom", "Quang", 16, 6),
        ("Susan", "Parkins", 17, 6),
        ("Brad", "Thompson", 18, 6),
        ("Thor", "Odinson", 19, 7),
        ("Todd", "Parkinson", 19, 7),
        ("Christy", "Martin", 20, 7),
        ("Hannah", "Rochelle", 21, 7),
        ("Scott", "Beam", 22, 8),
        ("Emile", "Smith", 23, 9),
        ("Anna", "Basie", 24, 8),
        ("Vincent", "Forwards", 25, 8),
        ("John", "Walker", 25, 8),
        ("Mary", "Kirkland", 26, 9),
        ("Justin", "Malley", 26, 9);