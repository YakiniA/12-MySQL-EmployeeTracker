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
  password: "",
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

  function addEmployee() {
  //  const role =  returnRole();
  //  const manager =  returnManager();
  var rolechoiceArray = [];
  var managerchoiceArray = [];

  connection.query("SELECT * from role", function (err, role) {

    for (var i = 0; i < role.length; i++) {
      rolechoiceArray.push(role[i].title);

    }

    connection.query("SELECT  CONCAT(employee.first_name,' ',employee.last_name) as managerName from employee", function (err, manager) {

      for (var i = 0; i < manager.length; i++) {
        managerchoiceArray.push(manager[i].managerName);

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
        ]).then(async function(answer) {

      // when finished prompting, insert a new item into the db with that info
 
       connection.query("SELECT * from role where role.title = '" +answer.role +"'", function(err, resdeptId) {
         var deptId;
          if (err) throw err;

          resdeptId.find(depId => {
          deptId = depId.department_id
          }
        );
          console.log(deptId);
          
          var managerName = answer.managerName;
          var firstName = managerName.split(" ",1)+"%";
       connection.query("SELECT * from employee where employee.first_name LIKE '" +firstName+"'", function(err , resmanagerId){
          if (err) throw err;
         var managerId;
         resmanagerId.find(mgrId =>{
          managerId = mgrId.id
         })
      console.log(managerId);
      
      var query = connection.query("INSERT INTO employee SET ?",
      {
        first_name: answer.firstName,
        last_name: answer.lastName,
        role_id: deptId,
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
    });
});
});
}

 function deptID(deptName) {


  var result= "";
  connection.query("SELECT department_id from role where role.title = '" +deptName +"'", function(err, res) {
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
  return  connection.query(query, managerName)
}
inquirerPrompts();