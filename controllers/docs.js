var jade = require('jade');

var controllers = require('../docs/controllers.js'),
		models 			= require('../docs/models.js'),
		errors			= require('../docs/errors.js');

/*
 * RENDER THE DOCS
 */
exports.showDocs = function(req, res) {
	res.render('docs2',
  	{
  		controllers : controllers.getControllers(),
  		models : models.getModels(),
  		errors : errors.getErrors(),
  	}
  )
};
