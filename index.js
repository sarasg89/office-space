const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./config/connection');
const cTable = require('console.table');

// Array of actions available to the user
const actions = [
    "View all employees",
    "Add employee",
    "Update employee role",
    "View all roles",
    "Add role",
    "View all departments",
    "Add department",
    "Quit"
]

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


// Function to initialize app
function init() {
    // Query database to list all existing departments
    let listDepartments = [];
    db.query('SELECT name FROM department', function (err, results) {
        results.forEach(element => {
            listDepartments.push(element.name);
        });
    })

    // Query database to list all existing roles
    let listRoles = [];
    db.query('SELECT title FROM role', function (err, results) {
        results.forEach(element => {
            listRoles.push(element.title);
        })
    })

    // Query database to list all existing employees
    let listEmployees = ["None"];
    db.query('SELECT first_name, last_name FROM employee', function (err, results) {
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
                // Query database: view all employees
                db.query('SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, (SELECT CONCAT(employee.first_name," ", employee.last_name) FROM employee WHERE id = e.manager_id) AS manager FROM employee AS e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY id;', function (err, results) {
                    console.table(results);
                    init();
                })
            } else if (data.actionsChoice === "Add employee") {
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
                        let roleID;
                        let managerID;
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

            } else if (data.actionsChoice === "Update employee role") {
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
                            db.query(`UPDATE employee SET role_id = ${roleID} WHERE first_name = "${data.employeeUpdateName.split(" ")[0]}" AND last_name = "${data.employeeUpdateName.split(" ")[1]}"`)
                        })
                        init();
                    })

            } else if (data.actionsChoice === "View all roles") {
                // Query database: view all roles
                db.query('SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id ORDER BY id;', function (err, results) {
                    console.table(results);
                    init();
                })
            } else if (data.actionsChoice === "Add role") {
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
            } else if (data.actionsChoice === "View all departments") {
                // Query database: view all departments
                db.query('SELECT * FROM department ORDER BY id', function (err, results) {
                    console.table(results);
                    init();
                })
            } else if (data.actionsChoice === "Add department") {
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
            } else if (data.actionsChoice === "Quit") {
                process.exit();
            }
        })
}

// Function call to initialize app
printApp();
init();