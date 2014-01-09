/*
 * EXTENSIONS
 */
var mongo           = require('mongodb'),
    mongoose        = require('mongoose');

/*
 * DATABASE SETUP
 */
mongoose.connect('mongodb://localhost/challenge');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
    console.log('LOAD: Mongoose!');
});