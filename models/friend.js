mongoose = require('mongoose');

var friendSchema = mongoose.Schema({
		userId: String,
    friends: Array
})

var Friend = mongoose.model('Friend', friendSchema);

exports.getFriendModel = function()
{
	return Friend;
}