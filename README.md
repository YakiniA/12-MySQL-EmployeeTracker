## Unit 12 MySQL : Employee Tracker

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

First need to set the database by using the queries in schema.sql, seed.sql

### NPM Module

* Inquirer      - Used the inquirer.prompt method to prompt the user with questions regarding the employees. Validate attribute in the inquirer module is used in order to ensure each questions was answered correctly.

* MySql         -  Used mySQL method for connecting to the database and perform queries.

* Util          -  Used Util to perform asynchronous operation.

* console.table -  Used console.table to print MySQL rows to the console.

### User Story

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

### Database 

<p>
<img src="Assets/schema.png" width="550" alt= "HomePage" height="500"/>
</p>

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
* The application can perform a variety of operations like Select, Insert, Update and Delete on employee, role and department table depending upon the inputs from the user using inquirer.
* The validation for the inputs is done on whether the inquirer prompt is being answered correctly or not.
* Depending on the inputs, mysql query is written and connection is being established to the database by using mysql NPM module.
* It also prompt the user with recent employee details and role for performing operations like add Employee, add Role, update Employee role, update employee manager etc.,

### Challenges Faced

* The initial challenge in writing the mysql query using JOINTS is resolved with the help of my instructor, TA.
* Always faced promise issue while trying to implement in async way. First, I tried to split up the queries into separate functions to use in my main function, while doing that it is not waiting for my sql operation to complete resulting in NULL array. Then with the help of class activities, I resolved this issue.
* As the employee has foreign key relation with role and role with department, deleting role and department not possible if it mapped with employee. It took time to figure out why the deletion is not occuring and did some work around for the same.

### Future Scope of development

Now, it displays a message 'There are employees associated with the department. DELETE THEM before trying to delete the department!!!' if there are employees associated to the role/department we want to delete. My future scope of developement is to prompt the user 'Whether they want to delete the employees associated with the role'. If yes, then delete the employees and then the role.

### Preview

![RecordedVideo](Assets/EmployeeTrackerVideo.gif)

### Submission Links

Link To the GitHub Repo : https://github.com/YakiniA/12-MySQL-EmployeeTracker

Link To The Demo Video : [Demo Video](https://drive.google.com/file/d/13vJ442TueGIxwaVV9Rcx_zOrYF8vfyzZ/view?usp=sharing)

#### References

StackOverflow : [StackOverflow - Failed to open referenced table](https://stackoverflow.com/questions/52377469/failed-to-open-the-referenced-table)<br/>
StackOverflow : [StackOverflow - Incompatible With Column Type](https://stackoverflow.com/questions/44153618/ora-02267-column-type-incompatible-with-referenced-column-type)<br/>
StackOverflow : [To access to exact value of array after 'Split'](https://stackoverflow.com/questions/7390091/can-i-access-directly-to-the-second-value-of-an-array-after-split)<br/>
StackOverflow : [Foreign Key Constraints on Update and delete](https://stackoverflow.com/questions/6720050/foreign-key-constraints-when-to-use-on-update-and-on-delete)<br/>
SQL Bolt : [SQL Bolt](https://sqlbolt.com/)<br/>
SQL : [SQL - Left Join](https://www.sqlservertutorial.net/sql-server-basics/sql-server-left-join/)<br/>