# Employee Database Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

This is a command-line application that manages a company's employee database, using Node.js, Inquirer, and MySQL.

The user can: 

- View all employees
- View all employees by department
- View all employees by manager
- Add an employee
- Remove an employee
- Update an employee's role
- Update an employee's manager
- View all roles
- Add a role
- Remove a role
- View all departments
- Add a department
- Remove a department

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Credits](#credits)
- [License](#license)

## Installation

Ensure that you have Node.js installed, v16 is best. You can follow this guide for installation instructions.

Clone this repository:

```bash
git clone git@github.com:sarasg89/office-space.git
```

Navigate into the directory where you cloned this repository:

```bash
cd ./office-space
```

Run npm install to retrieve dependencies:

```bash
npm install
```

Create a .env file in the root directory and add your MySQL password using this format:

```bash
DB_NAME='mycompany_db'
DB_PASSWORD=''
DB_USER='root'
```

Create the database and tables using the schema.sql file and populate the tables with the seeds.sql file:

```bash
mysql -u root -p 
mysql> source ./db/schema.sql
mysql> source ./db/seeds.sql
```

## Usage

Open your terminal and navigate to the directory

```bash
cd ./office-space
```

Run node to initialize the application

```bash
node index.js
```
[Link](https://drive.google.com/file/d/1xJbrHhxjtKRXwqPXkyb3t2JYdaPnsEzZ/view?usp=share_link) to the video walkthrough of the application.

### Screenshots

![initialize mysql in terminal](./assets/images/mysql.png)

![start the application in terminal](./assets/images/start.png)

![example of viewing employees](./assets/images/view%20employees.png)

![example of adding and deleting an employee](./assets/images/add%20delete%20employee.png)

![example of updating an employee](./assets/images/update%20employee.png)

## Credits

I followed [this tutorial](https://pencilprogrammer.com/self-referencing-foreign-key-in-mysql/) on how to create a self-referencing foreign key in MySQL.

I used this [ASCII generator](https://patorjk.com/software/taag/#p=display&h=1&v=1&f=Banner&t=Employee%20%0AManager) to create the ASCII art for the app.

NPM packages used:

- [inquirer.js](https://www.npmjs.com/package/inquirer)
- [console.table](https://www.npmjs.com/package/console.table)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [nodedemon](https://www.npmjs.com/package/nodemon)

## License

MIT License

Copyright (c) 2023 sarasg89

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
