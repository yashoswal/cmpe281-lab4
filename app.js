
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var index = require('./routes/index');
var gumballapi = require('./routes/gumballapi');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var app = express();

//configure app for cross-origin requests
app.all('*', function(req, res, next){

	console.log("In app all");
	if (!req.get('Origin')) return next();
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
	if ('OPTIONS' == req.method) return res.sendStatus(200);
	next();
});

var routes = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//configure app to use bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


// all environments
app.set('port', process.env.PORT || 3000);


//Routes for our API
var router = express.Router();

router.route('/Gumballs')
	.get(gumballapi.listGumballs);

router.route('/GumballAction')
	.post(gumballapi.handleOrders);


//Register our routes
app.use('/api', router); //all our routes will bw prefixed with /api
app.use('/', routes);


var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});