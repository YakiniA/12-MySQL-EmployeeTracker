var mysql = require("mysql");
var inquirer = require("inquirer");
const util = require("util");
var consoleTable = require("console.table")

let connection;
connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "webDev@2020",
  database: "employeeTracker_DB"
});



function inquirerPrompts() {

  console.log("==================================================");
  console.log("==================================================");
  console.log("~~~~~~~~~~~~~~~  EMPLOYEE TRACKER  ~~~~~~~~~~~~~~~");
  console.log("==================================================");
  console.log("==================================================");
  console.log('\n');
 
  inquirer.prompt([
    {
      type: "list",
      message: "Which you like to do?",
      name: "choice",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager"
      ]
    }]).then(teamChoice => {

      switch (teamChoice.choice) {

        case `View All Employees`:
          viewAllEmployees();

          break;

        case `View All Employees by Department`:

          viewEmployeesByDept();

          break;

        case `View All Employees by Manager`:

          viewEmployeesByManager();

          break;

        case `Add Employee`:

          addEmployee();

          break;

        case `Remove Employee`:

          removeEmployee();

          break;

        case `Update Employee Role`:

          updateEmployeeRole();

          break;

        case `Update Employee Manager`:

          updateEmployeeManager();

          break;

        default:

          break;

      }

    })
    .catch(function (err) {
      console.log(err);
    });
}

function viewAllEmployees() {

  const query = `SELECT e.id , e.first_name, e.last_name, r.title,  d.name as department, r.salary, CONCAT(m.first_name,' ',m.last_name) as manager from employee e 
                 LEFT JOIN role r ON e.role_id = r.id
                 LEFT JOIN department d ON r.department_id = d.id 
                 LEFT JOIN employee m ON m.id = e.manager_id`;

  connection.query(query,  (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('=============== View All Employees  ==============');
    console.log('\n');
    console.table(res);
    inquirerPrompts();
  });

}

function viewEmployeesByDept(){
  const query = `SELECT d.name AS department, r.title, e.id, e.first_name, e.last_name
    FROM employee e
    LEFT JOIN role r ON (r.id = e.role_id)
    LEFT JOIN department d ON (d.id = r.department_id)
    ORDER BY d.name`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('========== View Employees By Department  =========');
        console.log('\n');
        console.table(res);
        inquirerPrompts();
    });
}

function viewEmployeesByManager(){
  const query = `SELECT CONCAT(m.first_name, ' ', m.last_name) AS manager, d.name AS department, e.id, e.first_name, e.last_name, r.title
                 FROM employee e
                 LEFT JOIN employee m on m.id = e.manager_id
                 INNER JOIN role r ON (r.id = e.role_id && e.manager_id != 'NULL')
                 INNER JOIN department d ON (d.id = r.department_id)
                 ORDER BY manager`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('===========  View Employees By Manager  ==========');
        console.log('\n');
        console.table(res);
        inquirerPrompts();
    });
}

async function addEmployee() {

  var rolechoiceArray = [];
  var managerchoiceArray = ["None"];

  var role = await retrieveAllRoles();
  var employee = await retrieveAllEmployees();

  for (var i = 0; i < role.length; i++) {
    rolechoiceArray.push(role[i].title);

  }

  for (var i = 0; i < employee.length; i++) {
    managerchoiceArray.push(employee[i].managerName);
  }

  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first Name?",
        validate: inputValidation
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last Name?",
        validate: inputValidation
      },
      {
        name: "role",
        type: "rawlist",
        choices: rolechoiceArray

      },

      {
        name: "managerName",
        type: "rawlist",
        choices: managerchoiceArray
      }
    ]).then(async function (answer) {

      var resdeptId = await retrieveRoleBasedOnTitle(answer.role);
      var roleId;
      var managerId;

      resdeptId.find(depId => {
        roleId = depId.id
      });

      var managerName = answer.managerName;
      var firstName = managerName.split(" ", 1) + "%";

      var resmanagerId = await retrieveEmployeeBasedOnName(firstName);

      resmanagerId.find(mgrId => {
        managerId = mgrId.id
      })

      connection.query("INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: roleId,
          manager_id: managerId
        },
        function (err) {
          if (err) throw err;
          console.log('\n');
          console.log("======  Your employee data got inserted successfully!  ======");
          console.log('\n');
          inquirerPrompts();
        }
      );
    });
}

async function removeEmployee() {

  var choiceArray = [];

  var employee = await retrieveAllEmployees();

  for (var i = 0; i < employee.length; i++) {
    choiceArray.push("ID: " + employee[i].id + " Employee Name: " + employee[i].managerName);

  }

  inquirer
    .prompt([

      {
        name: "employee",
        type: "list",
        message: "Which employee you want to remove?",
        choices: choiceArray
      }
    ]).then(async function (answer) {

      var id = answer.employee.split(" ", 2)[1];
       console.log(JSON.parse(id));

      connection.query(
        "DELETE FROM employee WHERE ?",
        {
          id: id
        },

        function (err) {
          if (err) throw err;
          console.log('\n');
          console.log("======  Removed Employee's data successfully!  ====== ");
          console.log('\n');
          inquirerPrompts();

        });
    });
}

async function updateEmployeeRole() {

  var allEmployees = [];
  var rolechoiceArray = [];
  var employee = await retrieveAllEmployees();
  var role = await retrieveAllRoles();
  console.log("All Employees");
  console.log(employee);
  console.log(role);

  for (var i = 0; i < employee.length; i++) {
    allEmployees.push("ID: " + employee[i].id + " Employee Name: " + employee[i].managerName);
  }

  for (var i = 0; i < role.length; i++) {
    rolechoiceArray.push(role[i].title);

  }

  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "For which employee, role should be updated?",
        choices: allEmployees
      },
      {
        name: "employeeRole",
        type: "rawlist",
        message: "Please select the role for the selected employee...",
        choices: rolechoiceArray
      },

    ]).then(async function (answer) {
      var roleId;
      var resdeptId = await retrieveRoleBasedOnTitle(answer.employeeRole);
      resdeptId.find(depId => {
        roleId = depId.id
      }
      );
      
      var id = answer.employee.split(" ", 2)[1];
      console.log(JSON.parse(id));

      connection.query("UPDATE employee SET role_id = '" + roleId + "' WHERE id = '" + id + "'",

        function (err) {

          if (err) throw err;
          console.log('\n');
          console.log("======  Employee's role got updated successfully!  ======");
          console.log('\n');
          inquirerPrompts();
        });
    });
}


async function updateEmployeeManager() {

  var allEmployees = [];
  var allManager = ["None"];
  var employee = await retrieveAllEmployees();
  for (var i = 0; i < employee.length; i++) {
    allEmployees.push(employee[i].managerName);
    allManager.push(employee[i].managerName);
  }

  inquirer
    .prompt([
      {
        name: "employee",
        type: "rawlist",
        message: "For which employee, manager detail to be updated?",
        choices: allEmployees
      },
      {
        name: "manager",
        type: "rawlist",
        message: "Please select the manager for the selected employee...",
        choices: allManager
      },

    ]).then(async function (answer) {


      if (answer.employee === answer.manager) {
        console.log('\n');
        console.log(`===== Employee and manager should not be same. Please select a different manager =====`);
        console.log('\n');
        return updateEmployeeManager();
      }
      var empName = answer.employee;
      var mgrName = answer.manager;
      var empfirstName = empName.split(" ", 1) + "%";
      var mgrfirstName = mgrName.split(" ", 1) + "%";
      var mgrDetails = await retrieveEmployeeBasedOnName(mgrfirstName);
      var mgrId;
      mgrDetails.find(managerId => {
        mgrId = managerId.id
      });

      if (mgrId === undefined) {

        var query = connection.query("UPDATE employee SET manager_id = NULL WHERE first_name LIKE '" + empfirstName + "'",
          function (err) {
            if (err) throw err;
          });
      } else {
        var query = connection.query("UPDATE employee SET manager_id = '" + mgrId + "' WHERE first_name LIKE '" + empfirstName + "'",
          function (err) {
            if (err) throw err;
          });
      }
      console.log('\n');
      console.log("======  Employee's manager details got updated successfully!======  ");
      console.log('\n');
      inquirerPrompts();

    });
}

// To validate whether questions are answered. If not, return 'Please enter the detail' message
function inputValidation(value) {
  if (value != "" && value.match('[a-zA-Z][a-zA-Z]+$')) return true;
  else return `Please enter valid detail`;
}

async function retrieveAllEmployees() {

  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT  id, CONCAT(employee.first_name,' ',employee.last_name) as managerName from employee");

}

async function retrieveAllRoles() {

  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT * from role");
}

async function retrieveRoleBasedOnTitle(role) {

  connection.query = util.promisify(connection.query);
  // return await connection.query("SELECT * from role where role.title = '" + role + "'");
  return await connection.query("SELECT * from role where role.title = ?" , [role]);

}


async function retrieveEmployeeBasedOnName(name) {

  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT * from employee where employee.first_name LIKE ?" , [name]);
}


inquirerPrompts();