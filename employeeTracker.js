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

        case `RemoveEmployee`:

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
  console.log("View All Employees...\n");

  var query = "SELECT e.id , e.first_name, e.last_name, r.title,  d.name as department, r.salary, CONCAT(m.first_name,' ',m.last_name) as manager from employee e ";
  query += "LEFT JOIN role r ON e.role_id = r.id ";
  query += "LEFT JOIN department d ON r.department_id = d.id ";
  query += "LEFT JOIN employee m ON m.id = e.manager_id"

  connection.query(query, function (err, res) {
    console.log(res.length + " matches found!");

    console.table(res);
    inquirerPrompts();
  });

}

async function addEmployee() {
  //  const role =  returnRole();
  //  const manager =  returnManager();
  var rolechoiceArray = [];
  var managerchoiceArray = [];

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
            message: "What is the employee's first Name?"
          },
          {
            name: "lastName",
            type: "input",
            message: "What is the employee's last Name?"
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

          // when finished prompting, insert a new item into the db with that info
         var resdeptId = await retrieveRoleBasedOnTitle(answer.role);
          // connection.query("SELECT * from role where role.title = '" + answer.role + "'", function (err, resdeptId) {
            var roleId;
            // if (err) throw err;

            resdeptId.find(depId => {
              roleId = depId.id
            }
            );
            console.log(roleId);

            var managerName = answer.managerName;
            var firstName = managerName.split(" ", 1) + "%";
            connection.query("SELECT * from employee where employee.first_name LIKE '" + firstName + "'", function (err, resmanagerId) {
              if (err) throw err;
              var managerId;
              resmanagerId.find(mgrId => {
                managerId = mgrId.id
              })
              console.log(managerId);

              var query = connection.query("INSERT INTO employee SET ?",
                {
                  first_name: answer.firstName,
                  last_name: answer.lastName,
                  role_id: roleId,
                  manager_id: managerId
                },


                function (err) {
                  if (err) throw err;

                  console.log("Your employee data got inserted successfully!");
                  // re-prompt the user for if they want to bid or post
                  inquirerPrompts();
                }
              );
              // );
            });
          });
        // });
  
}

async function updateEmployeeRole(){
 
  var allEmployees = [];
  var rolechoiceArray =[];
  var employee = await retrieveAllEmployees();
  var role = await retrieveAllRoles();
  console.log("All Employees");
  console.log(employee);
  console.log(role);
 
     for (var i = 0; i < employee.length; i++) {
      allEmployees.push(employee[i].managerName);
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
          // connection.query("SELECT * from role where role.title = '" + answer.employeeRole + "'", function (err, resdeptId) {
           
            // if (err) throw err;

            resdeptId.find(depId => {
              roleId = depId.id
            }
            );
            console.log(roleId);

            var managerName = answer.employee;
            var firstName = managerName.split(" ", 1) + "%";

          // when finished prompting, insert a new item into the db with that info
         var query =  connection.query("UPDATE employee SET role_id = '"+roleId+"' WHERE first_name LIKE '"+firstName+"'" ,
         function (err) {
          if (err) throw err;

          console.log("Employee's role got updated successfully!");
          // re-prompt the user for if they want to bid or post
          inquirerPrompts();
         });
        });
      // });


      // });
// });
}
   

async function updateEmployeeManager(){
 
  var allEmployees = [];
  var allManager = ["None"];
    var employee = await retrieveAllEmployees();
    // allManager.push("None");
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
         
        ]).then(function (answer) {


          if(answer.employee === answer.manager){
             console.log(`Employee and manager should not be same. Please select a different manager`);
             updateEmployeeManager();
          }

          var empName = answer.employee;
          var empfirstName = empName.split(" ", 1) + "%";
          console.log("Emp FirstName" +empfirstName);
          var mgrName = answer.manager;
          var mgrfirstName = mgrName.split(" ", 1) + "%";
          console.log("MGR FirstName" +mgrfirstName)
           connection.query("SELECT * from employee where first_name LIKE '" +mgrfirstName+ "'", function (err, mgrDetails) {
             var mgrId;
             if (err) throw err;
          console.log(mgrDetails);
             mgrDetails.find(managerId => {
              mgrId = managerId.id
             }
             );
             console.log(mgrId);

          if(mgrId === undefined){
             
              var query =  connection.query("UPDATE employee SET manager_id = NULL WHERE first_name LIKE '"+empfirstName+"'");
          }else{
              var query =  connection.query("UPDATE employee SET manager_id = '"+mgrId+"' WHERE first_name LIKE '"+empfirstName+"'");
          }

            //when finished prompting, insert a new item into the db with that info
          //  var query =  connection.query("UPDATE employee SET manager_id = '"+mgrId+"' WHERE first_name LIKE '"+empfirstName+"'");
      
            if (err) throw err;

           console.log("Employee's manager details got updated successfully!");
           // re-prompt the user for if they want to bid or post
           inquirerPrompts();
        
         });
      });
}

 async function retrieveAllEmployees(){
  
  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT  CONCAT(employee.first_name,' ',employee.last_name) as managerName from employee");
   
}

async function retrieveAllRoles(){

  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT * from role");
}

async function retrieveRoleBasedOnTitle(role){

  connection.query = util.promisify(connection.query);
  return await connection.query("SELECT * from role where role.title = '" + role + "'");
}

function deptID(deptName) {


  var result = "";
  connection.query("SELECT department_id from role where role.title = '" + deptName + "'", function (err, res) {
    if (err) throw err;
    result = res;
    console.log(result);
  });
  return result;

}


function managerID(managerName) {
  // connection.query = util.promisify(connection.query);
  var managerId = "";
  var query = "SELECT employee.id from employee where CONCAT(employee.first_name,' ',employee.last_name) = ?"
  return connection.query(query, managerName)
}

inquirerPrompts();