var db = require('../database');
var auth = require('../authentication');

//this function is responsible for adding a new user
exports.add = function(conData, req, callback){
	
	//first connect to DB
	db.connect(conData, function(err, data){
		
		//when done check for any error
		if (err) {
			callback(err);
			return;
		}	
		//TODO: server validation
		
		//if no error prepare our user object with the values sent by the client
		var user = {
		  email: req.body['email'],
		  forename: req.body['forename'],
		  surname: req.body['surname'],
		  created: req.body['created'],
		};
		//perform the query
		data.query('INSERT INTO users SET ?', user, function (err, result) {
			//return control to the calling module
			callback(err, user);
		});
	});
};

exports.getAll = function(conData, req, callback){
	
	//first connect to DB
	db.connect(conData, function(err, data){
		
		//when done check for any error
		if (err) {
			callback(err);
			return;
		}	
		
		auth.loginUser(conData, req, function(err, result){
			
			if (err) {
				callback(err);
				return;
			}
			
			if(result.login === "success"){
				
				//perform the query
				data.query('SELECT * FROM users', function (err, result) {
					//return control to the calling module
					
					let data = JSON.stringify(result);
					
					callback(err, data);
				});
			}
			else{
				let err = {message:"username or password is incorrect"};
				callback(err);
			}
			
		});		
		
	});
};

exports.getById = function(conData, req, callback){
	
	//first connect to DB
	db.connect(conData, function(err, data){
		
		//when done check for any error
		if (err) {
			callback(err);
			return;
		}	

		auth.loginUser(conData, req, function(err, result){
			
			if (err) {
				callback(err);
				return;
			}
			
			if(result.login === "success"){
				
				let id = req.params.id;
				
				//perform the query
				data.query('SELECT * FROM users WHERE id = ' + id , function (err, result) {
					//return control to the calling module
					
					let data = JSON.stringify(result);
					
					callback(err, data);
				});
			}
			else{
				let err = {message:"username or password is incorrect"};
				callback(err);
			}
			
		});				
		
	});
};

exports.deleteById = function(conData, req, callback){
	
	//first connect to DB
	db.connect(conData, function(err, data){
		
		//when done check for any error
		if (err) {
			callback(err);
			return;
		}	

		auth.loginUser(conData, req, function(err, result){
			
			if (err) {
				callback(err);
				return;
			}
			
			if(result.login === "success"){
				
				let id = req.params.id;
				
				//perform the query
				data.query('DELETE FROM users WHERE id = ' + id , function (err, result) {
					//return control to the calling module
					
					let data = JSON.stringify(result);
					
					callback(err, data);
				});
			}
			else{
				let err = {message:"username or password is incorrect"};
				callback(err);
			}
			
		});				
		
	});
};

exports.updateById = function(conData, req, callback){
	
	//first connect to DB
	db.connect(conData, function(err, data){
		
		//when done check for any error
		if (err) {
			callback(err);
			return;
		}	
		
		auth.loginUser(conData, req, function(err, result){
			
			if (err) {
				callback(err);
				return;
			}
			
			if(result.login === "success"){
				
				let id = req.params.id;
				
				//if no error prepare our user object with the values sent by the client
				var user = {
				  email: req.body['email'],
				  forename: req.body['forename'],
				  surname: req.body['surname'],
				  created: req.body['created'],
				 
				};
				//perform the query
				data.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function (err, result) {
					//return control to the calling module
					callback(err, user);
				});
			}
			else{
				let err = {message:"username or password is incorrect"};
				callback(JSON.stringify(err));
			}
			
		});		
		
	});
};