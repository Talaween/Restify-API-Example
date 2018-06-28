//import mysql driver
var mysql = require('mysql');

//export a function to open a connection to the database, we will need
exports.connect = function(conData, callback){
	
	var con = mysql.createConnection({
		  host: conData.host,
		  user: conData.user, 
		  password: conData.password, 
		  database: conData.database
		});
	con.connect(function(err) {
		if (err) callback(err);
		callback(null, con);
	});
};

//export a function to create database tables
exports.createTables = function (conData, callback){
	
	var con = mysql.createConnection({
		  multipleStatements:true,
		  host: conData.host,
		  user: conData.user, 
		  password: conData.password, 
		  database: conData.database
		});
		
	var sql = "CREATE TABLE users (ID INT NOT NULL AUTO_INCREMENT, email VARCHAR(32), forename VARCHAR(16), surname VARCHAR(16), created DATETIME, PRIMARY KEY (ID))";
		
	con.query(sql, function (err, result) {
		//console.log("finish query:" + result);
		callback(err, result);
	});
	
};