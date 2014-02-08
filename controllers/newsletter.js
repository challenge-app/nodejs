/*
 * EXTENSIONS
 */
var async       			= require('async'),
    newsletterModel   = require('../models/newsletter');

/*
 * MODELS
 */
var Newsletter = newsletterModel.getNewsletterModel();

var timestamp = (new Date().getTime()).toString();

/*
 * [POST] ADD A NEW EMAIL
 *
 * @param String email
 * @return data
 */
exports.addEmail = function(req, res) {

	var data = req.body;

	var response = {};
	var status = 200; //200

	var newsletter;

	async.series([

		function(callback)
		{
			if(data.email === undefined)
			{
				response.error = "Give me an email!";
				status = 200; //400
				callback(true);
			}
			else
			{
				callback();
			}
		},
		function(callback)
		{
			newsletter = new Newsletter({
				email : data.email,
				timestamp : timestamp
			});

			newsletter.save(function(err, retData)
			{
				newsletter = retData;

				callback();
			});
		}
	],function(invalid)
	{
		if(!invalid)
			response = newsletter;

		res.status(status).send(response);
	});

}