## Unit 12 MySQL Homework: Employee Tracker

This purpose of this assignment is to build a CLI that provides solution for managing a company's employees using node, inquirer, and MySQL. 

### Prerequisite

To execute the generate Employee Tracker, the user must first install node.js.

Steps to Install NodeJS: [Node.js Installation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#windows-node-version-managers)

After installing node.js

To install NPM module dependencies, run the command:

```
npm install
```

The application will be invoked with the following command:

```
npm start
```

### NPM Module

* Inquirer      - Used the inquirer.prompt method to prompt the user with questions regarding the employees. Validate attribute in the inquirer module is used in order to ensure each questions was answered correctly.

* MySql         -  Used mySQL method for connecting to the database and perform queries.

* Util          -  Used Util to perform asynchronous operation.

* console.table -  Used console.table to print MySQL rows to the console.

## User Story

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

## Database 

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager
  
### Implementation

The below functionalities are implemented:

  * Add departments, roles, employees
  * View departments, roles, employees
  * Update employee roles
  * Update employee managers
  * View employees by manager
  * Delete departments, roles, and employees
  * View the total utilized budget of a department

### Application

* This application is used for managing the company's employees with the help of node,inquirer and mySql.
* This application can perform a variety of CRUD operations like Create, Read, Update and Delete on employee,role and department table data depending upon the inputs from the user using inquirer.
* The validation for the inputs is done on whether the inquirer prompt is being answered correctly or not.
* Depending on the inputs, mysql query is written and connection is being established to the database by using mysql NPM module.
* It also prompt the user with recent employee details and role for performing operations like add Employee , add Role, update Employee role, update employee manager etc.,

### Challenges Faced

* The initial challenge in writing the mysql query using JOINTS is resolved with the help of my instructor, TA.
* Always faced promise issue while trying to implement in async way. First, I tried to split up the queries into separate functions to use in my main function, while doing that it is not waiting for my sql operation to complete resulting in NULL array. Then with the help of class activities, I resolved this issue.
* As the employee has foreign key relation with role and role with department, deleting role and department not possible if it mapped with employee. It took time to figure out why the deletion is not occuring and some work around for the same.

### Future Scope of development

Now, it displays a message 'There are employees associated with the department. DELETE THEM before trying to delete the department!!!' if there are employees associated to the role/department we want to delete. My future scope of developement is to prompt the user 'Whether they want to delete the employees associated with the role'. If yes, then delete the employees and then the role.

### Preview



### Screenshots

