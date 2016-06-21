//imported credentials & modules
var credentials = require('./credentials.js')
var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({

	host	: 'localhost',
	user	: credentials.credentials.username,
	password: credentials.credentials.password,
	database: 'bamazon'
});

inquirer.prompt({
	name: 'whatToDo',
	type: 'list',
	message: 'Please select choose from the list below.',
	choices: ['   View Products for Sale', '   View Low Inventory', '   Add to Inventory', '   Add New Product']

}).then(function(answer){

	switch(answer.whatToDo){
		case '   View Products for Sale':
			viewProducts();
		break;

		case '   View Low Inventory':
			lowInventory();
		break;
		
		case '   Add to Inventory':
			addInventory();
		break;

		case '   Add New Product':
			newProduct();
		break;	
	}
});


function viewProducts(){

	connection.connect();
	connection.query('SELECT * FROM products', function(err, rows, fields){

		if(err) throw err;

		for(var data in rows){
			console.log("\nProduct Name: " + rows[data].ProductName);
			console.log("Product ID: " + rows[data].ItemID);
			price = parseFloat(rows[data].Price).toFixed(2);
			console.log("Price: $" + price);
			console.log("Quantity: " + rows[data].StockQuantity);
		}

	connection.end();


	});

}

function lowInventory(){

	connection.connect();
	connection.query('SELECT * FROM products', function(err, rows, fields){

		if(err) throw err;

		for(var data in rows){

			if(rows[data].StockQuantity < 5){
				console.log("\nProduct Name: " + rows[data].ProductName);
				console.log("Product ID: " + rows[data].ItemID);
				price = parseFloat(rows[data].Price).toFixed(2);
				console.log("Price: $" + price);
				console.log("Quantity: " + rows[data].StockQuantity);
			}

		}

	connection.end();

	});

}

function addInventory(){

	var choices = [];

	connection.connect();
	connection.query('SELECT ProductName FROM products', function(err, rows, fields){

		if(err) throw err;

		for(var data in rows){
			//choices.push("Product Name: " + rows[data].ProductName + "\nQuantity: " + rows[data].StockQuantity);
			choices.push(rows[data].ProductName);
		}
	
	inquirer.prompt({
		name: 'updateItem',
		type: 'list',
		message: 'For which item would you like to update the quantity?',
		choices

	}).then(function(answer){

		inquirer.prompt({
			name: 'updateQuan',
			type: 'input',
			//message: 'Please input the updated quantity',
			message: 'How much you like to add to the quantity?',
			validate: function(val){
				if(isNaN(val) == false){
					return true
				} else {

					console.log('Invalid input. Please try again.');
					return false;
				}
			}
		}).then(function(answers){

			var dbQuantity = "SELECT StockQuantity FROM products WHERE ProductName='" + answer.updateItem + "'";

			connection.query(dbQuantity, function(err, rows, fields){

				if(err) throw err;

				var currQuantity = parseInt(rows[0].StockQuantity);
				var updatedQuantity = parseInt(answers.updateQuan);

				updatedQuantity += currQuantity;

				var query = 'UPDATE products SET StockQuantity=' + updatedQuantity + ' WHERE ProductName=' + "'" + answer.updateItem + "'";

					connection.query(query, function(err, rows, fields){

					if(err) throw err;

					console.log("\nProduct updated successfully!");
					connection.end();

					/*inquirer.prompt({
						name: 'tryAgain',
						type: 'list',
						message: '\nWould you like to update another product?',
						choices: ['Yes', 'No'],
						validate: function(val){

							console.log(val);

							if(val == 'Yes'){
								return addInventory();

							} else {

								//connection.end();
							}
						}

					});*/
					
				});

			});



		/*	var query = 'UPDATE products SET StockQuantity=' + answers.newQuantity + ' WHERE ProductName=' + "'" + answer.updateItem + "'";

			console.log(query);

			connection.query(query, function(err, rows, fields){

				if(err) throw err;

				console.log("Product updated successfully!");
				connection.end();
			});*/
		});

	});	


	

	});
	
}

function newProduct(){

	inquirer.prompt([{
		name: 'newProdName',
		type: 'input',
		message: 'What is the name of the new product?'
	}, {
		name: 'newDept',
		type: 'input',
		message: 'What is the department for the new product?'
	}, {
		name: 'newPrice',
		type: 'input',
		message: 'What is the price of the new product?'/*,
		validate: function(value){


		}*/
	}, {
		name: 'newQty',
		type: 'input',
		message: 'How many of the new product are there?',
		validate: function(value){

			if(isNaN(value) == false){
				return true;
			} else {
				console.log("Invalid input. Please try again.");
				return false;
			}
		}
	}]).then(function(answers){

		connection.connect();

		parseFloat(answers.newPrice).toFixed(2);
		parseInt(answers.newQty);

		//var insert = "INSERT INTO products (ProductName, DepartmentName, Price, StockQuantity) VALUES (?, ?,?)";

		var insert = "INSERT INTO products SET ?"; 

		connection.query(insert, {
			ProductName: answers.newProdName,
			DepartmentName: answers.newDept,
			Price: answers.newPrice,
			StockQuantity: answers.newQty 
		}, function(err, rows, fields){

			if(err) throw err;

			console.log("New Product added successfully!");
			connection.end();
		});

	});





}