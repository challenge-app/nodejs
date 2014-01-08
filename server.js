var express = require('express'),
    user 	= require('./controllers/user'),
    docs 	= require('./controllers/docs'),
		app 	= express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

app.configure(function () {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
});

//app global vars
app.locals.title = 'Challenges';
 
app.get('/', docs.showDocs);

app.get('/user', user.findMe);
app.get('/user/logout', user.unAuth);
app.get('/user/:id', user.findById);

app.post('/user/auth', user.auth);
app.post('/user', user.addUser);

app.put('/user/:id', user.updateUser);
app.delete('/user/:id', user.deleteUser);
 
app.listen(3000);
console.log('Listening on port 3000...');
