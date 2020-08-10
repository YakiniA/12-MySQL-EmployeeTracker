var mysql = require("mysql");
var inquirer = require("inquirer");

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
   
        var query = connection.query(
          "SELECT employee.first_name, employee.last_name, role.title,  department.name, role.salary, INSERT INTO items SET ?",
          {
            item: answers.bidItem,
            price: answers.bidPrice,
            highestBid : answers.bidPrice
        
          },
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");
            // Call updateProduct AFTER the INSERT completes
          }
        );
        console.log(query.sql);
    }
