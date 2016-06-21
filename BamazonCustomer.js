//imported credentials & modules
var credentials = require('./credentials.js')
var inquirer = require('inquirer');
var mysql = require('mysql');

var price = "";
var result;

var connection = mysql.createConnection({

	host	: 'localhost',
	user	: credentials.credentials.username,
	password: credentials.credentials.password,
	database: 'bamazon'
});

connection.connect();
beginApp();


function beginApp(){

	return new Promise(function(resolved, rejected){

		connection.query('SELECT * FROM products', function (err, rows, fields){

			if(err){
				throw err;
				rejected();
			}

			for(var data in rows){
				console.log("\nProduct Name: " + rows[data].ProductName);
				console.log("Product ID: " + rows[data].ItemID);
				price = parseFloat(rows[data].Price).toFixed(2);
				console.log("Price: $" + price);
			}
			resolved();

		});
	});	
}

beginApp().then(buy, exitApp);

function buy(){

	inquirer.prompt([{

	name: "prodID",
	type: "input",
	message: "\nWhat is the id of the product you would like to buy?",
	validate: function(val){

		if(isNaN(val) == false){

   			return true;

   		} else {

   			console.log("\nInvalid product id. Please try again.");
   			return false;
   		}
   	}	
}, {
	name: "quantity",
	type: "input",
	message: "\nHow many would you like to purchase?",
	validate: function(val){
		if(isNaN(val) == false){

   			return true;

   		} else{

   			console.log("\nInvalid quantity. Please try again.");
   			return false;
   		}
	}

   }]).then(function(answers){

   		var updateProd = new Promise(function(resolve, reject){
			connection.query('SELECT StockQuantity, Price, DepartmentName FROM products WHERE ItemID=' + answers.prodID, 

				function(err, rows, fields){

				if(err) throw err;

				var result = parseInt(rows[0].StockQuantity);
				var price = parseFloat(rows[0].Price);

				var userQuan = parseInt(answers.quantity);
				var department = rows[0].DepartmentName;

				if(result >= userQuan){

					var total = (userQuan * price).toFixed(2);

					console.log("\nOrder Total: $" + total);

					result -= userQuan;

					var query = 'UPDATE products INNER JOIN departments ON products.DepartmentName = departments.DepartmentName SET products.StockQuantity=' + result + ', departments.totalSales= departments.totalSales +' + total + ' WHERE products.ItemID=' + answers.prodID + " AND departments.DepartmentName='" + department + "'";


					connection.query(query, function(err, result){

						if(err) throw err;

						console.log("\nOrder successfully placed!");

						resolve();

					});

				} else{

					console.log("Insufficient quantity.");
					return false;
				}
			})
			
			});

   			updateProd.then(function(){
				inquirer.prompt({
					name: 'whatsNext',
					type: 'list',
					message: '\nWhat would you like to do next?',
					choices: ['   Buy Again', '   Exit']

				}).then(function(answer){

					switch(answer.whatsNext){
						case '   Buy Again':
							beginApp().then(buy, exitApp);
						break;

						case '   Exit':
							exitApp();
						break;
					}
				});
			}, exitApp);
   });

}

function viewAllProducts(){

	connection.query('SELECT * FROM products', function (err, rows, fields){

		if(err){
			throw err;
			result = false;
			return result;
		}

		for(var data in rows){
			console.log("\nProduct Name: " + rows[data].ProductName);
			console.log("Product ID: " + rows[data].ItemID);
			price = parseFloat(rows[data].Price).toFixed(2);
			console.log("Price: $" + price);
		}
		result = true;
		return result;
	});

}

function callback(err, rows, fields){

	if(err)
		throw err;

	for(var data in rows){
		console.log("\nProduct Name: " + rows[data].ProductName);
		console.log("Product ID: " + rows[data].ItemID);
		price = parseFloat(rows[data].Price).toFixed(2);
		console.log("Price: $" + price);
	}
}	


function exitApp(){

	connection.end();
}