mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    authenticationToken: String
})

var User = mongoose.model('User', userSchema);

exports.getUserModel = function()
{
	return User;
}