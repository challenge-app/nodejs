/*
 * EXTENSIONS
 */
var express = require('express'),
    user 	= require('./controllers/user'),
    docs 	= require('./controllers/docs');

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

/*
 * GET ROUTES
 */
app.get('/', docs.showDocs);
app.get('/user', user.findAll);
app.get('/user/logout', user.unAuth);
app.get('/user/friends', user.getFriends);
app.get('/user/deleteAll', user.deleteAll);

app.get('/user/:id', user.findById);

/*
 * POST ROUTES
 */
app.post('/user/friend', user.addFriend);
app.post('/user/auth', user.auth);
app.post('/user/find', user.find);
app.post('/user', user.addUser);

/*
 * PUT ROUTES
 */
app.put('/user/:id', user.updateUser);

/*
 * DELETE ROUTES
 */
app.delete('/user/:id', user.deleteUser);
 
/*
 * START IN PORT 3000
 */
app.listen(3000);
console.log('Listening on port 3000...');
