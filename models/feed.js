var mongoose = require('mongoose');
		Schema 	 = mongoose.Schema;

var feedSchema = mongoose.Schema({
	users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    type: Number, //0: Foi desafiado, 1: Aceitou e cumpriu o desafio, 2: Recusou o desafio, 3: Alguém duvidou, 4: Alguém curtiu
	
	challenge: { type: String, ref: 'Challenge' },
   	culprit: { type: String, ref: 'User' },

    whoElse: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    notify: Boolean,
    seen: Boolean,
    
    timestamp: String
});

var Feed = mongoose.model('Feed', feedSchema);

exports.getFeedModel = function()
{
	return Feed;
}
