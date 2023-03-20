const inquirer = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');

// Array of actions available to the user
const actions = [
    "View all employees",
    "View all employees by manager",
    "View all employees by department",
    "Add employee",
    "Delete employee",
    "Update employee's role",
    "Update employee's manager",
    "View all roles",
    "Add role",
    "Delete role",
    "View all departments",
    "Add department",
    "Delete department",
    "*Quit*"
]

// Function to print "Employee Manager" to the terminal
function printApp() {
    console.log(`       
    #######                                                    
    #       #    # #####  #       ####  #   # ###### ######    
    #       ##  ## #    # #      #    #  # #  #      #         
    #####   # ## # #    # #      #    #   #   #####  #####     
    #       #    # #####  #      #    #   #   #      #         
    #       #    # #      #      #    #   #   #      #         
    ####### #    # #      ######  ####    #   ###### ######    
    #     #                                                    
    ##   ##   ##   #    #   ##    ####  ###### #####           
    # # # #  #  #  ##   #  #  #  #    # #      #    #          
    #  #  # #    # # #  # #    # #      #####  #    #          
    #     # ###### #  # # ###### #  ### #      #####           
    #     # #    # #   ## #    # #    # #      #   #           
    #     # #    # #    # #    #  ####  ###### #    #             
    `);
}

// Function to display the employee table
function employeeViewAll() {
    // Query database: view all employees
    db.query('SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, (SELECT CONCAT(employee.first_name," ", employee.last_name) FROM employee WHERE id = e.manager_id) AS manager FROM employee AS e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY id;', function (err, results) {
        console.table(results);
        init();
    })
}

// Function to display employees by manager
function employeeViewManager() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which manager's employees do you want to see?",
                choices: listEmployees,
                name: "viewByManager"
            }
        ])
        .then((data) => {
            if (data.viewByManager === "None") {
                // Query database to show the employee table filtering by manager id
                db.query(`SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, (SELECT CONCAT(employee.first_name," ", employee.last_name) FROM employee WHERE id = e.manager_id) AS manager FROM employee AS e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id WHERE e.manager_id IS null ORDER BY id`, function (err, results) {
                    console.table(results);
                    init();
                })
            } else {
                // Query database: get the ID for the selected manager
                db.query(`SELECT id FROM employee WHERE first_name = "${data.viewByManager.split(" ")[0]}" AND last_name = "${data.viewByManager.split(" ")[1]}"`, function (err, results) {
                    managerID = results[0].id;

                    // Query database to show the employee table filtering by manager id
                    db.query(`SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, (SELECT CONCAT(employee.first_name," ", employee.last_name) FROM employee WHERE id = e.manager_id) AS manager FROM employee AS e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id WHERE e.manager_id = ${managerID} ORDER BY id`, function (err, results) {
                        console.table(results);
                        init();
                    })
                })
            }
        })
}

// Function to display employees by department
function employeeViewDept() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which department's employees do you want to see?",
                choices: listDepartments,
                name: "viewByDept"
            }
        ])
        .then((data) => {
            // Query database: get the ID for the selected manager
            db.query(`SELECT id FROM department WHERE name = "${data.viewByDept}"`, function (err, results) {
                deptId = results[0].id;
                // Query database to show the employee table filtering by manager id
                db.query(`SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, (SELECT CONCAT(employee.first_name," ", employee.last_name) FROM employee WHERE id = e.manager_id) AS manager FROM employee AS e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id WHERE department_id = ${deptId} ORDER BY id`, function (err, results) {
                    console.table(results);
                    init();
                })
            })
        })
}

// Function to add a new employee
function employeeAdd() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "newEmployeeFirst"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "newEmployeeLast"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                choices: listRoles,
                name: "newEmployeeRole"
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                choices: listEmployees,
                name: "newEmployeeManager"
            }
        ])
        .then((data) => {
            // Query database: get the ID of the new employee's role
            db.query(`SELECT id FROM role WHERE title = "${data.newEmployeeRole}"`, function (err, results) {
                roleID = results[0].id;
                // Option of no manager selected, the manager ID is null
                if (data.newEmployeeManager === "None") {
                    // Query database: add a new employee
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.newEmployeeFirst}", "${data.newEmployeeLast}", ${roleID}, null)`);
                    console.log(`${data.newEmployeeFirst} ${data.newEmployeeLast} added to the database`);
                    init();
                    // Option for the name of an employee has been selected as manager    
                } else {
                    // Query database: get the ID for the new employee's manager
                    db.query(`SELECT id FROM employee WHERE first_name = "${data.newEmployeeManager.split(" ")[0]}" AND last_name = "${data.newEmployeeManager.split(" ")[1]}"`, function (err, results) {
                        managerID = results[0].id;
                        // Query database: add a new employee
                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.newEmployeeFirst}", "${data.newEmployeeLast}", ${roleID}, ${managerID})`);
                        console.log(`${data.newEmployeeFirst} ${data.newEmployeeLast} added to the database`);
                        init();
                    })
                }
            })
        })
}

// Function to delete employees
function employeeDelete() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee do you want to delete?",
                choices: listEmployees,
                name: "employeeDeleteName"
            },
        ])
        .then((data) => {
            // Query database: delete employee by name
            db.query(`SELECT id FROM employee WHERE first_name = "${data.employeeDeleteName.split(" ")[0]}" AND last_name = "${data.employeeDeleteName.split(" ")[1]}"`, function (err, results) {
                employeeID = results[0].id;
                db.query(`DELETE FROM employee WHERE id = ${employeeID}`, function () {
                    console.log(`${data.employeeDeleteName.split(" ")[0]} ${data.employeeDeleteName.split(" ")[1]} has been deleted from the database`);
                    init();
                })
            });
        })
}

// Function to update employee's role
function employeeUpdateRole() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee's role do you want to update?",
                choices: listEmployees,
                name: "employeeUpdateName"
            },
            {
                type: "list",
                message: "Which new role do you want to assign to the selected employee?",
                choices: listRoles,
                name: "employeeUpdateRole"
            }
        ])
        .then((data) => {
            let roleID;
            // Query database: get the ID of the role selected
            db.query(`SELECT id FROM role WHERE title = "${data.employeeUpdateRole}"`, function (err, results) {
                roleID = results[0].id;
                // Query database: update employee table
                db.query(`UPDATE employee SET role_id = ${roleID} WHERE first_name = "${data.employeeUpdateName.split(" ")[0]}" AND last_name = "${data.employeeUpdateName.split(" ")[1]}"`);
                console.log(`The role for ${data.employeeUpdateName.split(" ")[0]} ${data.employeeUpdateName.split(" ")[1]} has been updated`);
                init();
            })
        })
}

// Function to update employee's manager
function employeeUpdateManager() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee's manager do you want to update?",
                choices: listEmployees,
                name: "employeeUpdateName"
            },
            {
                type: "list",
                message: "Which new manager do you want to assign to the selected employee?",
                choices: listEmployees,
                name: "employeeUpdateManager"
            }
        ])
        .then((data) => {
            // Query database: select employee by name
            db.query(`SELECT id FROM employee WHERE first_name = "${data.employeeUpdateManager.split(" ")[0]}" AND last_name = "${data.employeeUpdateManager.split(" ")[1]}"`, function (err, results) {
                managerID = results[0].id;

                // Query database: update employee table
                db.query(`UPDATE employee SET manager_id = ${managerID} WHERE first_name = "${data.employeeUpdateName.split(" ")[0]}" AND last_name = "${data.employeeUpdateName.split(" ")[1]}"`);
                console.log(`Manager relationship has been updated for ${data.employeeUpdateName.split(" ")[0]} ${data.employeeUpdateName.split(" ")[1]}`);
                init();
            });
        })
}

// Function to display the role table
function roleView() {
    // Query database: view all roles
    db.query('SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id ORDER BY id;', function (err, results) {
        console.table(results);
        init();
    })
}

// Function to add a new role
function roleAdd() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the new role?",
                name: "newRoleName"
            },
            {
                type: "input",
                message: "What is the salary of the new role?",
                name: "newRoleSalary"
            },
            {
                type: "list",
                message: "Which department does the role belong to?",
                choices: listDepartments,
                name: "newRoleDepartment"
            }
        ])
        .then((data) => {
            // Query database: get the ID of the selected department
            let departmentId;
            db.query(`SELECT id FROM department WHERE name = "${data.newRoleDepartment}"`, function (err, results) {
                departmentId = results[0].id;
                // Query database: add a new role
                db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${data.newRoleName}", ${data.newRoleSalary}, ${departmentId})`);
                console.log(`${data.newRoleName} added to the database`);
                init();
            })
        })
}

// Function to delete roles
function roleDelete() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which role do you want to delete?",
                choices: listRoles,
                name: "roleDelete"
            },
        ])
        .then((data) => {
            // Query database: delete role by name
            db.query(`SELECT id FROM role WHERE title = "${data.roleDelete}"`, function (err, results) {
                roleID = results[0].id;
                db.query(`DELETE FROM role WHERE id = ${roleID}`, function () {
                    console.log(`${data.roleDelete} has been deleted from the database`);
                    init();
                })
            });
        })
}

// Function to display the department table
function deptView() {
    // Query database: view all departments
    db.query('SELECT * FROM department ORDER BY id', function (err, results) {
        console.table(results);
        init();
    })
}

// Function to add a new department
function deptAdd() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "newDepartment"
            }
        ])
        .then((data) => {
            // Query database: add a new department
            db.query(`INSERT INTO department (name) VALUES ("${data.newDepartment}")`);
            console.log(`${data.newDepartment} added to database`);
            init();
        })
}

// Function to delete departments
function deptDelete() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which department do you want to delete?",
                choices: listDepartments,
                name: "deptDelete"
            },
        ])
        .then((data) => {
            // Query database: delete department by name
            db.query(`SELECT id FROM department WHERE name = "${data.deptDelete}"`, function (err, results) {
                deptId = results[0].id;
                db.query(`DELETE FROM department WHERE id = ${deptId}`, function () {
                    console.log(`${data.deptDelete} has been deleted from the database`);
                    init();
                })
            });
        })
}

let listDepartments = [];
let listRoles = [];
let listEmployees = ["None"];
let roleID;
let managerID;
let deptId;
let employeeID;

// Function to initialize app
function init() {
    // Query database to list all existing departments
    db.query('SELECT name FROM department', function (err, results) {
        listDepartments = [];
        results.forEach(element => {
            listDepartments.push(element.name);
        });
    })

    // Query database to list all existing roles
    db.query('SELECT title FROM role', function (err, results) {
        listRoles = [];
        results.forEach(element => {
            listRoles.push(element.title);
        })
    })

    // Query database to list all existing employees
    db.query('SELECT first_name, last_name FROM employee', function (err, results) {
        listEmployees = ["None"];
        results.forEach(element => {
            listEmployees.push(`${element.first_name} ${element.last_name}`);
        })
    })

    inquirer
        .prompt([{
            type: "list",
            message: "What would you like to do?",
            choices: actions,
            name: "actionsChoice",
        }
        ])
        .then((data) => {
            if (data.actionsChoice === "View all employees") {
                employeeViewAll();
            } else if (data.actionsChoice === "View all employees by manager") {
                employeeViewManager();
            } else if (data.actionsChoice === "View all employees by department") {
                employeeViewDept();
            } else if (data.actionsChoice === "Add employee") {
                employeeAdd();
            } else if (data.actionsChoice === "Delete employee") {
                employeeDelete();
            } else if (data.actionsChoice === "Update employee's role") {
                employeeUpdateRole();
            } else if (data.actionsChoice === "Update employee's manager") {
                employeeUpdateManager();
            } else if (data.actionsChoice === "View all roles") {
                roleView();
            } else if (data.actionsChoice === "Add role") {
                roleAdd();
            } else if (data.actionsChoice === "Delete role") {
                roleDelete();
            } else if (data.actionsChoice === "View all departments") {
                deptView();
            } else if (data.actionsChoice === "Add department") {
                deptAdd();
            } else if (data.actionsChoice === "Delete department") {
                deptDelete();
            } else if (data.actionsChoice === "*Quit*") {
                console.log("Bye");
                process.exit();
            }
        })
}

// Function call to initialize app
printApp();
init();