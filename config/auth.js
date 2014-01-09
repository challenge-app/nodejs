/*
 * EXTENSIONS
 */
 var userModel = require('../models/user');

/*
 * MODELS
 */
var User = userModel.getUserModel();

/*
 * CHECK AUTH
 */
exports.isAuthenticated = function(req, callback)
{
    var reqToken = req.header('X-AUTH-TOKEN');

    if(reqToken === undefined)
    {
        callback(null);
    }
    else
    {
        User.findOne({authenticationToken : reqToken}).exec(function(err, user)
        {
            if(user === null)
            {
                callback(null);
            }
            else
            {   
                callback(user);
            }
        });
    }
}
