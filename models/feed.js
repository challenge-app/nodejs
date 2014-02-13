var mongoose = require('mongoose');
		Schema 	 = mongoose.Schema;

var feedSchema = mongoose.Schema({
    challenge: { type: String, ref: 'Challenge' },
    whatHappened: Number, //0: Foi desafiado, 1: Aceitou e cumpriu o desafio, 2: Recusou o desafio, 3: Alguém duvidou, 4: Alguém curtiu
    who: { type: String, ref: 'User' }
});

var Feed = mongoose.model('Feed', feedSchema);

exports.getFeedModel = function()
{
	return Feed;
}
