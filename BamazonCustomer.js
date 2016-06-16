//imported credentials & modules
var credentials = require('./credentials.js')
var prompt = require('prompt');
var mysql = require('mysql');

var price = "";

var connection = mysql.createConnection({

	host	: 'localhost',
	user	: credentials.credentials.username,
	password: credentials.credentials.password,
	database: 'bamazon'
});

connection.connect();

connection.query('SELECT * FROM products AS blah', callback);


connection.end();
//connection.release(); //not a function??



function callback(err, rows, fields){

	if(err)
		throw err;

	//console.log(rows[0].ProductName);

	for(var data in rows){
		console.log("\nProduct: " + rows[data].ProductName);
		price = parseFloat(rows[data].Price).toFixed(2);
		console.log("Price: $" + price);
	}

	/*for(var i=0; i < rows.length; i++){
		console.log(rows[i])	
	}*/



}