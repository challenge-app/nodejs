mongoose = require('mongoose');

var challengeBaseSchema = mongoose.Schema({
    description: String,
    votes: Number
});

var challengeSchema = mongoose.Schema({
		senderId: String,
    receiverId: String,
		challengeBaseId: String,
    reward: Number
});

var ChallengeBase = mongoose.model('challengeBase', challengeBaseSchema),
		Challenge 		= mongoose.model('challenge', challengeSchema);

exports.getChallengeBase = function()
{
	return ChallengeBase;
}

exports.getChallenge = function()
{
	return Challenge;
}