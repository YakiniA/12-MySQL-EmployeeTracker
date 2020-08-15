var mysql = require("mysql");
var inquirer = require("inquirer");
const util = require("util");
var consoleTable = require("console.table");

let connection;
connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employeeTracker_DB"
});



function inquirerPrompts() {

  console.log("==================================================");
  console.log("~~~~~~~~~~~~~~~  EMPLOYEE TRACKER  ~~~~~~~~~~~~~~~");
  console.log("==================================================");

  console.log('\n');
 
  inquirer.prompt([
    {
      type: "rawlist",
      message: "Which you like to do?",
      name: "choice",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "View By Roles",
        "View Department Budget",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Update Employee Manager",
        "Remove Employee",
        "Remove Department",
        "Remove Role",
        "Exit"
        
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

        case `View By Roles`:

        viewByRoles();

        break;

        case `View Department Budget`:

          viewDepartmentBudget();

          break;

        case `Add Employee`:

          addEmployee();

          break;
        
        case `Add Department`:

          addDepartment();

          break;

        case `Add Role`:

          addRole();

          break;

        case `Update Employee Role`:

          updateEmployeeRole();

          break;

        case `Update Employee Manager`:

          updateEmployeeManager();

          break;

        case `Remove Employee`:

          removeEmployee();

          break;

        case `Remove Department`:

          removeDepartment();

          break;

        case `Remove Role`:

          removeRole();

          break;

        case `Exit`:

          console.log("~~ ..Thank You.. !!! ~~");
          connection.end();
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

function viewByRoles(){
  const query = `SELECT r.id as roleId,  r.title as roleName, r.salary, r.department_id as departmentId, d.name as departmentName 
  FROM employee e LEFT JOIN role r on e.role_id = r.id LEFT JOIN department d on r.department_id = d.id GROUP BY r.id, r.title;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('===========  View By Roles  ==========');
        console.log('\n');
        console.table(res);
        inquirerPrompts();
    });
}

function viewDepartmentBudget(){
  const query = `SELECT d.id ,  d.name as departmentName, SUM(r.salary) as utilizedBudget 
                 FROM employee e LEFT JOIN role r on e.role_id = r.id LEFT JOIN department d on r.department_id = d.id GROUP BY d.id, d.name`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('===========  View Department Budget  ==========');
        console.log('\n');
        console.table(res);
        inquirerPrompts();
    });
}

//Function to perform add Employee
async function addEmployee() {

  //Setting the array to prompt the user to select
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

      //Retrieve Role Id from Role table based on 'role title'
      var resdeptId = await retrieveRoleBasedOnTitle(answer.role);
      var roleId;
      var managerId;

      resdeptId.find(depId => {
        roleId = depId.id
      });

      var managerName = answer.managerName;
      var firstName = managerName.split(" ", 1) + "%";

      //Retrieve manager id from employee based on name
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

//Function to add department
function addDepartment(){

  inquirer
    .prompt([
      {
        name: "deptName",
        type: "input",
        message: "Please enter the department name you wish to add...",
        validate: inputValidation
      },
    ]).then(async function (answer) {
      connection.query("INSERT INTO department SET ?",
      {
        name : answer.deptName
      },
      function (err) {
        if (err) throw err;
        console.log('\n');
        console.log("======  Department got inserted successfully!  ======");
        console.log('\n');
        inquirerPrompts();
      }
      );
  });

  }


//Function to add Role
async function addRole(){

  //Setting the array to prompt the user to select
  var choiceArray = [];

  var department = await retrieveAllDepartment();

  for (var i = 0; i < department.length; i++) {
    choiceArray.push("ID: " + department[i].id + " Department Name: " + department[i].name);

  }
  inquirer
  .prompt([
    {
      name: "roleName",
      type: "input",
      message: "Please enter the role you wish to add.  ",
      validate: inputValidation
    },
    {
      name: "roleSalary",
      type: "input",
      message: "Please enter the salary for the role.  ",
      validate: numberValidation
    },
    {
      name: "deptName",
      type: "rawlist",
      message: "Please link the role to department?",
      choices: choiceArray
    }
  ]).then(async function (answer) {
    var deptId;

    var depName= answer.deptName.split(" ", 5)[4];
   //Retrieve department id from department based on name
    const resdeptId = await retrieveDepartmentByName(depName);
    resdeptId.find(depId => {
      deptId = depId.id
    }
    );

      connection.query("INSERT INTO role SET ?",
      {
        title : answer.roleName,
        salary: answer.roleSalary,
        department_id: deptId
      },
      function (err) {
        if (err) throw err;
        console.log('\n');
        console.log("======  Role got inserted successfully!  ======");
        console.log('\n');
        inquirerPrompts();
      }
      );
  });

  }

//Function to remove employee
async function removeEmployee() {

  //Setting the array to prompt the user to select
  var choiceArray = [];
  var employee = await retrieveAllEmployees();

  for (var i = 0; i < employee.length; i++) {
    choiceArray.push("ID: " + employee[i].id + " Employee Name: " + employee[i].managerName);
  }

  inquirer
    .prompt([

      {
        name: "employee",
        type: "rawlist",
        message: "Which employee you want to remove?",
        choices: choiceArray
      }
    ]).then(async function (answer) {

      var id = answer.employee.split(" ", 2)[1];
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

//Function to remove department
async function removeDepartment(){

  //Setting the array to prompt the user to select
  var choiceArray = [];

  var department = await retrieveAllDepartment();

  for (var i = 0; i < department.length; i++) {
    choiceArray.push("ID: " + department[i].id + " Department Name: " + department[i].name);

  }

  inquirer
    .prompt([

      {
        name: "employee",
        type: "rawlist",
        message: "Which department you want to remove?",
        choices: choiceArray
      }
    ]).then(async function (answer) {

      var id = answer.employee.split(" ", 2)[1];
      connection.query("DELETE from department WHERE ?",
      {
        id : id
      },
    
      function (err, res) {
     
        if (err){
          // Capture the err and tell the user that delete operation cannot be performed as this table is maaped to employee.
          if( err.errno === 1451) {
          console.log('\n');
          console.log("=====  There are employees associated with the department. DELETE THEM before trying to delete the department!!!  =====");
          console.log('\n');
          
          return inquirerPrompts();
          } else throw err;
        } else if(res.affectedRows === 1) {
          
          console.log('\n');
          console.log("======  Department got removed successfully!  ======");
          console.log('\n');
          return inquirerPrompts();
        }
      } 
      );

  });
}

//Function to perform remove role
async function removeRole(){
  
  var choiceArray = [];

  var roles = await retrieveAllRoles();

  for (var i = 0; i < roles.length; i++) {
    choiceArray.push("ID: " + roles[i].id + " Role Name: " + roles[i].title);

  }

  inquirer
    .prompt([

      {
        name: "employee",
        type: "rawlist",
        message: "Which role you want to remove?",
        choices: choiceArray
      }
    ]).then(async function (answer) {

      var id = answer.employee.split(" ", 2)[1];
      connection.query("DELETE from role WHERE ?",
      {
        id : id
      },
      function (err, res) {
     
        if (err){
          // Capture the err and tell the user that delete operation cannot be performed as this table is maaped to employee.
          if( err.errno === 1451) {
          console.log('\n');
          console.log("=====  There are employees associated with the department. DELETE THEM before trying to delete the role!!!  =====");
          console.log('\n');
          
          return inquirerPrompts();
          } else throw err;
        } else if(res.affectedRows === 1) {
          
          console.log('\n');
          console.log("======  Role got removed successfully!  ======");
          console.log('\n');
          return inquirerPrompts();
        }
      } 
      
  );
});
}

//Function to perform update employee Role
async function updateEmployeeRole() {

  var allEmployees = [];
  var rolechoiceArray = [];
  var employee = await retrieveAllEmployees();
  var role = await retrieveAllRoles();
  
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
        type: "rawlist",
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

//Function to perform update employee manager
async function updateEmployeeManager() {

  var allEmployees = [];
  var allManager = ["None"];
  var employee = await retrieveAllEmployees();
  for (var i = 0; i < employee.length; i++) {
    allEmployees.push("ID: " + employee[i].id + " Employee Name: " + employee[i].managerName);
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
      var mgrName = answer.manager;
      var mgrfirstName = mgrName.split(" ", 1) + "%";

      var id = answer.employee.split(" ", 2)[1];
      var mgrDetails = await retrieveEmployeeBasedOnName(mgrfirstName);
      var mgrId;
      mgrDetails.find(managerId => {
        mgrId = managerId.id
      });

      if (mgrId === undefined) {

        var query = connection.query("UPDATE employee SET manager_id = NULL WHERE id = '" + id + "'",
          function (err) {
            if (err) throw err;
          });
      } else {
        var query = connection.query("UPDATE employee SET manager_id = '" + mgrId + "' WHERE id = '" + id + "'",
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

function numberValidation(value){
 
    if (value != "" && value.match(/^[1-9]\d*$/)) return true;
    else return `Please enter valid detail`;

}

async function retrieveAllEmployees() {

  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT  id, CONCAT(employee.first_name,' ',employee.last_name) as managerName from employee");

}

async function retrieveAllDepartment() {

  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT id, name from department");

}

async function retrieveDepartmentByName(name) {

  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT * from department where name = ?" , [name]);

}

async function retrieveAllRoles() {

  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT * from role");
}

async function retrieveRoleBasedOnTitle(role) {

  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT * from role where role.title = ?" , [role]);

}


async function retrieveEmployeeBasedOnName(name) {

  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT * from employee where employee.first_name LIKE ?" , [name]);
}

inquirerPrompts();