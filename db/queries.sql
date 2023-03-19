-- -- VIEW ALL ROLES --
SELECT
role.id AS id, role.title AS title, department.name AS department, role.salary AS salary
FROM role
JOIN department ON role.department_id = department.id;

-- -- VIEW ALL EMPLOYEES --
SELECT
e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, (SELECT CONCAT(employee.first_name," ", employee.last_name) FROM employee WHERE id = e.manager_id) AS manager
FROM employee AS e
JOIN role ON e.role_id = role.id
JOIN department ON role.department_id = department.id
ORDER BY id;

-- VIEW ALL EMPLOYEES BY MANAGER ID --
SELECT 
e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, (SELECT CONCAT(employee.first_name," ", employee.last_name) FROM employee WHERE id = e.manager_id) AS manager 
FROM employee AS e
JOIN role ON e.role_id = role.id
JOIN department ON role.department_id = department.id
WHERE department_id = 1
ORDER BY id