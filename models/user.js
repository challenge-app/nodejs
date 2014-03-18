var mongoose = require('mongoose');
		Schema 	 = mongoose.Schema;

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    authenticationToken: String,
    following : [{ type: Schema.Types.ObjectId, ref: 'User' }],
  	followers : [{ type: Schema.Types.ObjectId, ref: 'User' }],
  	reputation : Number,
  	username : String,
  	firstName : String,
  	lastName : String,
  	phone : String,
    timestamp : String
})

userSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        delete ret.__v;
    }
});

var User = mongoose.model('User', userSchema);

exports.getUserModel = function()
{
	return User;
}

exports.onlyPublic = function()
{
  return '-authenticationToken -password';
}

exports.onlyPublicSimple = function()
{
  return '-authenticationToken -password -followers -following';
}
