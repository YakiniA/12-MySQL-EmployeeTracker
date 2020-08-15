DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;


CREATE TABLE department(
   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   title VARCHAR(30) NOT NULL,
   salary DECIMAL(10,2) NOT NULL,
   department_id INT UNSIGNED NOT NULL,
   CONSTRAINT FK_departmentId FOREIGN KEY (department_id) REFERENCES department(id) 
);

CREATE TABLE employee(
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  CONSTRAINT FK_roleId FOREIGN KEY (role_id) REFERENCES role(id),
  manager_id INT UNSIGNED,
  CONSTRAINT FK_managerId FOREIGN KEY (manager_id) REFERENCES employee(id) 
 
);
