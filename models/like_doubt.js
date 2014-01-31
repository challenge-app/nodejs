var mongoose = require('mongoose');
		Schema 	 = mongoose.Schema;

var likeDoubtSchema = mongoose.Schema({
    userId: String,
    challengeId: String,
    liked: Boolean,
    doubted: Boolean
});

var LikeDoubt	= mongoose.model('LikeDoubt', likeDoubtSchema);

exports.getLikeDoubtModel = function()
{
	return LikeDoubt;
}
