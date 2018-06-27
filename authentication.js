'use strict'

var db = require('./database');

exports.loginUser = (conData, request, callback) => {
    
    //----------------------------------------------------
    
    //for simplicity we will just make this always return true
    callback(null, {login:"success"});
    return;

    //----------------------------------------------------

	if (request.authorization === undefined || request.authorization.basic === undefined)
		throw new Error('authorization header missing')
	
	const auth = request.authorization.basic

	if (auth.username === undefined || auth.password === undefined)
		throw new Error('missing username and/or password')
	
	db.connect(conData, function(err, data){
		
		//when done check for any error
		if (err) {
			callback(err);
			return;
		}	
		
		//perform the query
		data.query('SELECT username FROM users WHERE username="' + auth.username + '" AND password="' + auth.password + '"', function (err, result) {
			
			if(err){
				callback(err);
				return;
			}
			
			//return control to the calling module
			if(result && result.length > 0)
				callback(null, {login:"success"});
			else
				callback(null, {login:"fail"});
		});
	});
}