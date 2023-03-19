const inquirer = require('inquirer');

// Array of actions available to the user
const actions = [
    "Add employee",
    "Update employee role",
    "View all roles",
    "Add role",
    "View all departments",
    "Add department"
]

// Question asked to the user in order to create a new department
const newDepartment = "What is the name of the department?";

// Array of questions asked to the user in order to create a new role
const newRole = [
    "What is the name of the role?",
    "What is the salary of the role?",
    "What deparment does the role belong to?"
]

// Array of questions asked to the user in order to create a new employee
const newEmployee = [
    "What is the employee's first name?",
    "What is the employee's last name?",
    "What is the employee's role?",
    "Who is the employee's manager?"
]

// Array of questions asked to the user in order to update an employee's role
const updateRole = [
    "Which employee's role do you want to change?",
    "Which role do you want to assign the selected employee?"
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
    printApp();

    inquirer
        .prompt([{
            type: "list",
            message: "What would you like to do?",
            choices: actions,
            name: "actionsChoice",
        }
        ])
        .then((data) => {

        })
}

// Function call to initialize app
init();