//imported credentials & modules
var credentials = require('./credentials.js')
var inquirer = require('inquirer');
var mysql = require('mysql');

var price = "";

var connection = mysql.createConnection({

	host	: 'localhost',
	user	: credentials.credentials.username,
	password: credentials.credentials.password,
	database: 'bamazon'
});

connection.connect();

connection.query('SELECT * FROM products', callback);


//connection.end();
//connection.release(); //not a function??



function callback(err, rows, fields){

	if(err)
		throw err;

	console.log(rows);

	for(var data in rows){
		console.log("\nProduct Name: " + rows[data].ProductName);
		console.log("Product ID: " + rows[data].ItemID);
		price = parseFloat(rows[data].Price).toFixed(2);
		console.log("Price: $" + price);
	}

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

  			connection.query('SELECT StockQuantity, Price FROM products WHERE ItemID=' + answers.prodID, 

   				function(err, rows, fields){

   				if(err) throw err;

   				var result = parseInt(rows[0].StockQuantity);
   				var price = parseFloat(rows[0].Price);

   				var userQuan = parseInt(answers.quantity);

   				if(result >= userQuan){

   					console.log("Order Total: " + (userQuan * price).toFixed(2));

   					result -= userQuan;

   					var query = 'UPDATE products SET StockQuantity=' + result + ' WHERE ItemID=' + answers.prodID;

   					connection.query(query, function(err, result){

   						if(err) throw err;

   						console.log("Order successfully placed!");
   						connection.end();
   					});

   				} else{

   					console.log("Insufficient quantity.");
   					return false;
   				}

   			});




	   });

	/*for(var i=0; i < rows.length; i++){
		console.log(rows[i])	
	}*/



}