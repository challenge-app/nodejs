var mongoose = require('mongoose');
		Schema 	 = mongoose.Schema;

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    authenticationToken: String,
  	friends : [{ type: Schema.Types.ObjectId, ref: 'User' }],
  	reputation : Number,
  	username : String,
  	firstName : String,
  	lastName : String,
  	phone : String
})

userSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        delete ret.__v;
        delete ret.friends;
    }
});

userSchema.methods.noToken = function()
{
	this.authenticationToken = undefined;

	return this;
}

userSchema.methods.hasFriend = function(id)
{
	if(this.friends.indexOf(id) != -1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

var User = mongoose.model('User', userSchema);

exports.getUserModel = function()
{
	return User;
}
