var	mongoose = require('mongoose'),
		Schema 	 = mongoose.Schema;

var challengeBaseSchema = mongoose.Schema({
    description: String,
    generalLikes: Number,
  	challenges: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
  	generalDoubts: Number,
  	def: Boolean,
  	difficulty: Number, //0: facil, 1: medio, 2: dificil
  	timestamp: String
});

var challengeSchema = mongoose.Schema({
	info: { type: String, ref: 'ChallengeBase' },
	sender: { type: String, ref: 'User' },
    receiver: { type: String, ref: 'User' },
    status: Number, //-1: Não viu, 0: Viu mas não aceitou, 1: Viu e aceitou, 2: Viu e recusou
    url: String, //URL DO VIDEO
    type: String, //Tipo: video/foto
    reward: String,
    likes: Number,
    doubts: Number,
    timestamp: String
});

challengeSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.__v;
        delete ret.sender.authenticationToken;
        delete ret.receiver.authenticationToken;
    }
});

challengeBaseSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.__v;
    }
});

var ChallengeBase 	= mongoose.model('ChallengeBase', challengeBaseSchema),
		Challenge 			= mongoose.model('Challenge', challengeSchema);

exports.getChallengeBase = function()
{
	return ChallengeBase;
}

exports.getChallenge = function()
{
	return Challenge;
}

/*
exports.mixChallenge = function(chall, challBase)
{
	var result = {};

	result.challengeBaseId 	= chall.challengeBaseId;
	result.senderId 				= chall.senderId;
	result.receiverId 			= chall.receiverId;
	result.reward 					= chall.reward;

	if(challBase === undefined)
	{
		ChallengeBase.findOne({_id : chall.challengeBaseId}, function(err, base)
		{
			if(base == null)
			{
				throw "Something is really wrong! I can't find the challenge base!";
			}
			else
			{
				result.description 			= base.description;
				result.votes 						= base.votes;

				return result;
			}
		});
	}
	else
	{
		result.description 			= challBase.description;
		result.votes 						= challBase.votes;

		return result;
	}
}*/