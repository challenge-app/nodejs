/*
 * EXTENSIONS
 */
var express = require('express');

/*
 * CONTROLLERS
 */
var user 				= require('./controllers/user'),
    challenge 	= require('./controllers/challenge'),
    docs 				= require('./controllers/docs');

/*
 * CONFIG
 */
var mongo = require('./config/mongodb');

/*
 * DECLARE APP
 */
var app 	= express();

/*
 * FOR RENDERING HTML
 */
app.set('/views', express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);

/*
 * ACCESS PUBLIC FOLDER
 */
app.use(express.static(__dirname + '/public'));

/*
 * FOR SESSIONS!
 */
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

/*
 * CONFIGURING THE APP
 */
app.configure(function () {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
});

/*
 * GLOBAL VARS (soh pra lembrar)
 */
app.locals.title = 'Challenges';

app.get('/', docs.showDocs);

/*
 * USER GET ROUTES
 */
app.get('/user', user.findAll);
app.get('/user/logout', user.unAuth);
app.get('/user/friends', user.getFriends);
app.get('/user/deleteAll', user.deleteAll);

app.get('/user/:id', user.findById);

/*
 * USER POST ROUTES
 */
app.post('/user/friend', user.addFriend);
app.post('/user/auth', user.auth);
app.post('/user/find', user.find);
app.post('/user', user.addUser);

/*
 * CHALLENGE GET ROUTES
 */
app.get('/challenge/received', challenge.challengesReceived);
app.get('/challenge/sent', challenge.challengesSent);
 
/*
 * CHALLENGE POST ROUTES
 */
app.post('/challenge', challenge.newChallenge);

/*
 * START IN PORT 3000
 */
app.listen(3000);
console.log('Listening on port 3000...');
