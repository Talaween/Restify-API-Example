//import restify module
var restify = require('restify');
//import our seller module which handles all CRUD operations on sellers
var user = require('./model/user');

var db = require('./database');

const corsMiddleware = require('restify-cors-middleware')

//add 'Authorization' to allowHeader to tell preflight browser OPTION request that basic auth is allowed
const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['http://localhost:3000'],
  credentials: true,
  allowHeaders: ['API-Token', 'Authorization'],
  exposeHeaders: ['API-Token-Expiry'],

})

//create the restify module
const server = restify.createServer()

server.pre(cors.preflight)
server.use(cors.actual)

//initialise the server with required plugins
server.use(restify.plugins.fullResponse())
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser())
server.use(restify.plugins.authorizationParser())

//prepare our database connection parameters
const databaseData = { 
	host:"localhost",
	user:"root",
	password: "",
	database: "myBlog"
};
//save server port on global variable
var port = 8080;

//------------Users Routes-----------------

/**
 * @api {post} /users add new user
 * @apiDescription add a new user using POST method
 * @apiGroup user
 * @apisamplerequest off
 * @apiPermission none
 * @apiHeader Content-Type application/json
 * @apiHeader If-None-Match (optional) the eTag hash from the last request
 * @apiParam {String} email the email address of the user
 * @apiParam {String} forename first name of the user
 * @apiParam {String} surname last name of the user
 * @apiParam {DateTime} created timestamp when this user is created
 * @apiSuccess {Object} response top-level object
 * @apiSuccess {String} response.message a message conforming addign is success
 * @apiParamExample {json} Request Body
 *   {
 *      "email": "awad@talaween.net",
 *      "forename":"Mahmoud",
 *      "surname":"Awad",
 *      "created":"2018-06-27T18:25:43.511Z"
 *   }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "user added successfully"
 *      }
 * @apiError 422/Unprocessable-Entity a parameter is missing
 * @apiErrorExample {json} List error
 *    HTTP/1.1 422 Unprocessable Entity
 *    {
 *      "error": "parameter missing"
 *    }
 * @apiError 400/Bad-Request a parameter is missing or not in correct format
 * @apiErrorExample {json} List error
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "error": "a parameter is missing or value invalid"
 *    }
 */
server.post('/users', (req, res) => {
	
	//we are atempting to add a user
	user.add(databaseData, req, function (err, data){
		
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET, POST')
		
		if(err){
			res.status(400);
			res.end("error:" + err);
			return;
		}
		//if no error let's set proper response code and have a party
		res.status(201);
		res.end(JSON.stringify({message:"user added successfully"}));
	});
})

/**
 * @api {get} /users get all users
 * @apiDescription retrieve the list of all users in json format
 * @apiGroup user
 * @apisamplerequest off
 * @apiPermission none
 * @apiHeader Content-Type application/json
 * @apiHeader If-None-Match (optional) the eTag hash from the last request
 * @apiSuccess {Object} response top-level object
 * @apiSuccess {Array} response.users the list of all users
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "users": [
 *              {"id":"1","email":"awad@talaween.net", "forname":"Mahmoud", "surname":"Awad", "created":"2018-06-27T18:25:43.511Z"},
 *              {"id":"2","email":"another@something.net", "forname":"Mike", "surname":"Owen", "created":"2018-06-26T18:25:43.511Z"}             
 *              ]
 *      }
 */
server.get('/users', (req, res) => {
	
	user.getAll(databaseData, req, function (err, data){
	
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET')
		if(err){
			res.status(400);
			res.end("error:" + err);
			return;
		}
		
		res.status(200);
		res.end(data);
	});
})


/**
 * @api {get} /users/:id get a specific users
 * @apiDescription retrieve the user with the id provided
 * @apiGroup user
 * @apisamplerequest off
 * @apiPermission none
 * @apiHeader Content-Type application/json
 * @apiHeader If-None-Match (optional) the eTag hash from the last request
 * @apiSuccess {Object} response top-level object
 * @apiSuccess {Object} response.user the user object
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user":{"id":"1","email":"awad@talaween.net", "forname":"Mahmoud", "surname":"Awad", "created":"2018-06-27T18:25:43.511Z"} *              
 *      }
 */
server.get('/users/:id', (req, res) => {

	
	//we are atempting to retrieve one user
	//note that we get the user id through the req.params.id, id matches the path parameter name 
	user.getById(databaseData, req, function (err, data){
		
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET')
		
		if(err){
			res.status(400);
			res.end("error:" + err);
			return;
		}
		res.status(200);
		res.end(data);
	});
})

/**
 * @api {delete} /users/:id delete a user
 * @apiDescription delete a user using delete method
 * @apiGroup user
 * @apisamplerequest off
 * @apiPermission none
 * @apiHeader Content-Type application/json
 * @apiHeader If-None-Match (optional) the eTag hash from the last request
 * @apiParam {String} id the unique id of of the user
 * @apiParam {String} forename first name of the user
 * @apiParam {String} surname last name of the user
 * @apiParam {DateTime} created timestamp when this user is created
 * @apiSuccess {Object} response top-level object
 * @apiSuccess {String} response.message a message conforming addign is success
 * @apiExample {curl} Example usage:
 *     curl -i http://api.example.com/users/1
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "user deleted successfully"
 *      }
 * @apiError 422/Unprocessable-Entity user id was not found
 * @apiErrorExample {json} List error
 *    HTTP/1.1 422 Unprocessable Entity
 *    {
 *      "error": "user id was not found"
 *    }
 */
server.del('/users/:id',(req, res) => {
	
	user.deleteById(databaseData, req, function (err, data){
		
		if(err){
			res.status(400);
			res.end("error:" + err);
			return;
		}
		res.status(201);
		res.end(data);
	});

});

/**
 * @api {put} /users/:id update a user
 * @apiDescription update a user data using PUT method
 * @apiGroup user
 * @apisamplerequest off
 * @apiPermission none
 * @apiHeader Content-Type application/json
 * @apiHeader If-None-Match (optional) the eTag hash from the last request
 * @apiParam {String} email the email address of the user
 * @apiParam {String} forename first name of the user
 * @apiParam {String} surname last name of the user
 * @apiSuccess {Object} response top-level object
 * @apiSuccess {String} response.message a message conforming addign is success
 * @apiParamExample {json} Request Body
 *   {
 *      "email": "awad@talaween.net",
 *      "forename":"Mahmoud",
 *      "surname":"Awad"
 *   }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "user updated successfully"
 *      }
 * @apiError 422/Unprocessable-Entity user id was not found
 * @apiErrorExample {json} List error
 *    HTTP/1.1 422 Unprocessable Entity
 *    {
 *      "error": "user  id was not found"
 *    }
 * @apiError 400/Bad-Request a parameter is missing or not in correct format
 * @apiErrorExample {json} List error
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "error": "a parameter is missing or value invalid"
 *    }
 */
server.put('/users/:id', (req, res) => {
	
	//we are atempting to update a user
	user.updateById(databaseData, req, function (err, data){
		

		if(err){
			res.status(400);
			res.end("error:" + err);
			return;
		}
		
		res.status(200);
		res.end("success");
	});
})

//this route will allow to create tables in the database
//it should be a confidential method and can be performed only by an admin
server.post('/createTables', (req, res) => {
	
	db.createTables(databaseData, function(err, state){
		if(err) {
			res.status(400);
			res.end("an error has occured:" + err);
			return;
		}
		res.status(200);
		res.end("tables were created successfully");
	});
})

//start the server 
server.listen(port, err => {
	if (err) {
		console.error(err)
	} else {
		console.log(`App is ready on port ${port}`)
	}
})