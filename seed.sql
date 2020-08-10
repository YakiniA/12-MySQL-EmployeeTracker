USE employeeTracker_DB;

/* Insert  Rows into department table */
INSERT INTO department (name)
VALUES ("Engineer");

INSERT INTO department (name)
VALUES ("Sales");

INSERT INO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Legal");


INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 12000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Team Lead", 15000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing", 11500, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountants", 12500, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Business Analyst", 13500, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Legal Officer", 17500, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Agar", "Sathya", 1, NULL);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Hritish", "Nilan", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sam", "Rodeo", 3, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ritish", "Ram", 4, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Neal", "Rimmy", 5, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sumo", "Saarika", 6, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rini", "Daari", 7, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Janan", "Shenba", 8, 5);
