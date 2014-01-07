exports.showDocs = function(req, res) {
	res.locals.test = 'hi';
	res.render('docs.ejs');
};