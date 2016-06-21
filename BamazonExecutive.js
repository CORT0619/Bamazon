//imported credentials & modules
var credentials = require('./credentials.js')
var inquirer = require('inquirer');
var mysql = require('mysql');
var formatTable = require('cli-table');

var connection = mysql.createConnection({

	host	: 'localhost',
	user	: credentials.credentials.username,
	password: credentials.credentials.password,
	database: 'bamazon'
});

inquirer.prompt({
	name: 'whatToDo',
	type: 'list',
	message: 'Please choose from the list below.',
	choices: ['   View Products Sales by Department', '   Create New Department']

}).then(function(answer){

	switch(answer.whatToDo){
		case '   View Products Sales by Department':
			viewProdSales();
		break;

		case '   Create New Department':
			newDepartment();
		break;
	}
});

function viewProdSales(){
	connection.connect();
	connection.query("SELECT * FROM departments", function(err, rows, fields){

		if(err) throw err;

		var table = new Table({

			head: ['DepartmentID', 'DepartmentName', 'OverHeadCosts', 'ProductSales', 'TotalProfit'],
			colWidth: [25, 25]	
		});

		for(var data in rows)
			table.push([rows[data].DepartmentID, rows[data].DepartmentName, rows[data].OverHeadCosts, rows[data].ProductSales, parseInt(rows[data].ProductSales) -  parseInt(rows[data].OverHeadCosts)]);

	});
}

function newDepartment(){

	inquirer.prompt([{
		name: 'newDeptName',
		type: 'input',
		message: 'Input the name of the new department.'

	}, {
		name: 'overheadCosts',
		type: 'input',
		message: "Input the new department's overhead costs."

	}, {
		name: 'totalSales',
		type: 'input',
		message: 'Input the total sales of the new department.'		
	}]).then(function(answers){

		connection.connect();

		var departInsert = "INSERT INTO departments(DepartmentName, OverHeadCosts, TotalSales) VALUES('" + answers.newDeptName + "', " + answers.overheadCosts + ", " + answers.totalSales + ")";

		//console.log(departInsert);

		connection.query(departInsert, function(err, rows, fields){

			if(err) throw err;

			console.log("Department Successfully added!");

		});		
	})

}


