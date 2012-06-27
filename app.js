
/**
 * Module dependencies.
 */

var express = require('express')
	, twitter = require('ntwitter');

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
  io.set("log level", 0)
});

// Twitter
var twit = new twitter({
	consumer_key: 'Ktz7HRoA3PGr6ARNzIXcag',
	consumer_secret: 'ZUsnNEhQ3vXjx2ZjLtuUYUyiCJtmYkuG3wNtRC2M',
	access_token_key: '46713-aqtHStll8KiHOKjQSZQdqdMWXitypZkThBA47o96J0',
	access_token_secret: 'iM7jvgIA8s5vDUjwCki1G31sJaGQ6746LgHHQtbbE'
});

twit.stream('statuses/filter', {'track':'#WaldoCanyonFire,#WaldoFire,#waldocanyon,Waldo,Colorado Springs'}, function(stream) {
			stream.on('data', function (data) {
				io.sockets.emit('tweet',data);
			});
			stream.on('error', function(err){
				console.log(err)
			});
			stream.on('end', function (response) {
							console.log(response);
			});
			stream.on('destroy', function (response) {
				console.log(response);
			});
		});

// Socket.io
io.sockets.on('connection', function (socket) {
	
});


// Routes

app.get('/', function(req,res){
	res.render('index',{title:'Waldo Canyon Fire Tracker'})
});

app.get('/about', function(req,res){
	res.render('about',{title:'About'})
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});
