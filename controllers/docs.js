var jade = require('jade');

var data = require('../docs/all.js');

/*
 * RENDER THE DOCS
 */
exports.showDocs = function(req, res) {
	res.render('docs2',
  	{
  		controllers : data.getControllers(),
  		models : data.getModels(),
  	}
  )
};
