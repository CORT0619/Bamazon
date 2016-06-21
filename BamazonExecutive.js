//imported credentials & modules
var credentials = require('./credentials.js')
var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');

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

	var prodSales;
	var overhead;
	var totalProfit;

	connection.connect();
	connection.query("SELECT * FROM departments", function(err, rows, fields){

		if(err) throw err;

		var table = new Table({
			chars: { 'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
  'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚',
  'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─',
  'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│'},
			head: ['DepartmentID', 'DepartmentName', 'OverHeadCosts', 'ProductSales', 'TotalProfit'],
			colWidths: [12, 25, 12, 12, 12]	
		});

		for(var data in rows){

			table.push([rows[data].DepartmentID, rows[data].DepartmentName, rows[data].OverHeadCosts, rows[data].TotalSales, (parseInt(rows[data].TotalSales) - parseInt(rows[data].OverHeadCosts))]);
		}

		console.log(table.toString());
		connection.end();

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


