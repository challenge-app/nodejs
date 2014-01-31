var mongoose = require('mongoose');
		Schema 	 = mongoose.Schema;

var newsletterSchema = mongoose.Schema({
    email: String,
    timestamp: String
});

var Newsletter = mongoose.model('Newsletter', newsletterSchema);

exports.getNewsletterModel = function()
{
	return Newsletter;
}
