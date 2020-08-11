var mysql = require("mysql");
var inquirer = require("inquirer");
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
  

  function inquirerPrompts(){
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

        switch(teamChoice.choice){

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
        .catch(function(err) {
        console.log(err);
      });
    }
 
    function viewAllEmployees() {
        console.log("View All Employees...\n");
   
        var query = "SELECT e.id , e.first_name, e.last_name, r.title,  d.name as department, r.salary, CONCAT(m.first_name,' ',m.last_name) as manager from employee e " ;
          query += "LEFT JOIN role r ON e.role_id = r.id ";
          query += "LEFT JOIN department d ON r.department_id = d.id " ;
          query += "LEFT JOIN employee m ON m.id = e.manager_id"
        
          connection.query(query, function(err, res) {
            console.log(res.length + " matches found!");
        
            console.table(res);
         });
       
       }


       inquirerPrompts();