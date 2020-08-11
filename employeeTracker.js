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
            inquirerPrompts();
         });
       
       }

    function addEmployee() {
         const role =  returnRole();
         const manager =  returnManager();
         var choiceArray = [];
         var choiceArray2 = [];
         connection.query("SELECT * from role", function(err, role) {
         
          for (var i = 0; i < role.length; i++) {
            choiceArray.push(role[i].title);
            console.log(choiceArray);
          }

         });

         connection.query("SELECT  CONCAT(employee.first_name,' ',employee.last_name) as managerName from employee", function(err, manager) {
         
          for (var i = 0; i < manager.length; i++) {
            choiceArray2.push(manager[i].managerName);
            console.log(choiceArray2);
          }

         });
       console.log(choiceArray);
       console.log(choiceArray2);
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
          name: "choice",
          type: "rawlist",
          choices: [...choiceArray]
          
          },

          {
            name: "choice",
            type: "rawlist",
            choices: [...choiceArray2]
          }
        ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });

       
       }


     function returnRole(){
    
      connection.query("SELECT * from role", function(err, role) {
         return role;
       })
       }
 
       function returnManager(){
        connection.query("SELECT  CONCAT(employee.first_name,' ',employee.last_name) as manager from employee", function(err , manager) { 
          return manager;
       })

       }

       inquirerPrompts();