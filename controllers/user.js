/*
 * EXTENSIONS
 */
var bcrypt 		= require('bcrypt'),
	async 		= require('async'),
	auth 		= require('../config/auth'),
	userModel 	= require('../models/user');

/*
 * MODELS
 */
var User = userModel.getUserModel();

var timestamp = function()
{
    return (new Date().getTime()).toString();
}
/*
 * [POST] FOLLOW A USER
 * (need to be authed) 
 *
 * @param String email
 * @return Friend data
 */
exports.follow = function(req, res) {

	var data = req.body;

	var response = {};
	var status = 200;

	var user,
	toFollowUser,
	following;

	async.series([

		function(callback)
		{
			auth.isAuthenticated(req, function(reqData)
			{
				user = reqData;

				if(user == null)
				{
					response.code = 10;
					status = 401; //401
					callback(true);
				}
				else if(data._id === undefined)
				{
					response.code = 3;
					status = 400; //400
					callback(true);
				}
				else
				{
					callback();
				}
			});
		},
		function(callback)
		{
			User.findOne({ _id : data._id }).exec(function(err, reqData)
			{
				toFollowUser = reqData;

				if(toFollowUser == null
				|| toFollowUser === undefined)
				{
					response.code = 11;
					status = 422; //422
					callback(true);
				}
				else
				{
					callback();
				}
			});
		},
		function(callback)
		{
			if(user.following.indexOf(data._id) != -1)
			{
				response.code = 14;
				status = 422
				callback(true);
			}
			else
			{
				user.following.push(toFollowUser);
				user.timestamp = timestamp();

				user.save(function(err, reqData)
				{
					user = reqData;

					callback();
				});
			}
		},
		function(callback)
		{
			if(toFollowUser.followers.indexOf(user._id) == -1)
			{
				toFollowUser.followers.push(user);
				toFollowUser.timestamp = timestamp();

				toFollowUser.save(function(err, reqData)
				{
					callback();
				});
			}
			else
			{
				callback();
			}
		},
		function(callback)
		{
			user.populate('following', userModel.onlyPublicSimple(), function(err, reqData)
			{
				following = reqData.following;

				callback();
			});
		}

	], function(invalid)
	{
		if(!invalid)
			response = following;

		res.status(status).send(response);
	});

}

/*
 * [POST] UNFOLLOW A USER
 * (need to be authed) 
 *
 * @param String email
 * @return Friend data
 */
exports.unfollow = function(req, res) {

	var data = req.body;

	var response = {};
	var status = 200;

	var user,
	toUnfollowUser,
	following;

	async.series([

		function(callback)
		{
			auth.isAuthenticated(req, function(reqData)
			{
				user = reqData;

				if(user == null)
				{
					response.code = 10;
					status = 401; //401
					callback(true);
				}
				else if(data._id === undefined)
				{
					response.code = 3;
					status = 400; //400
					callback(true);
				}
				else
				{
					callback();
				}
			});
		},
		function(callback)
		{
			User.findOne({ _id : data._id }).exec(function(err, reqData)
			{
				toUnfollowUser = reqData;

				if(toUnfollowUser == null
				|| toUnfollowUser === undefined)
				{
					response.code = 11;
					status = 422; //422
					callback(true);
				}
				else
				{
					callback();
				}
			});
		},
		function(callback)
		{
			var userIndex = user.following.indexOf(data._id);

			if(userIndex != -1)
			{
				user.following.splice(userIndex,1);
				user.timestamp = timestamp();

				user.save(function(err, reqData)
				{
					user = reqData;

					callback();
				});
			}
			else
			{
				response.code = 27;
				status = 422
				callback(true);
			}
		},
		function(callback)
		{
			var userIndex = toUnfollowUser.followers.indexOf(user._id);

			if(userIndex != -1)
			{
				toUnfollowUser.followers.splice(userIndex,1);
				toUnfollowUser.timestamp = timestamp();

				toUnfollowUser.save(function(err, reqData)
				{
					callback();
				});
			}
			else
			{
				callback();
			}
		},
		function(callback)
		{
			user.populate('following', userModel.onlyPublicSimple(), function(err, reqData)
			{
				following = reqData.following;

				callback();
			});
		}

	], function(invalid)
	{
		if(!invalid)
			response = following;

		res.status(status).send(response);
	});

}

/*
 * [POST] EDIT THE USER
 * (need to be authed) 
 *
 * @param JSON fields
 * @return User data
 */
exports.edit = function(req, res) {

	var data = req.body;

	var response = {};
	var status = 200;

	var user;

	async.series([

		function(callback)
		{
			auth.isAuthenticated(req, function(reqData)
			{
				user = reqData;

				if(user == null)
				{
					response.code = 10;
					status = 401;
					callback(true);
				}
				else
				{
					callback();
				}
			});
		},
		function(callback)
		{
			if(data.email !== undefined)
			{
				user.email = data.email;
			}
			if(data.username !== undefined)
			{
				user.username = data.username;
			}
			if(data.firstName !== undefined)
			{
				user.firstName = data.firstName;
			}
			if(data.lastName !== undefined)
			{
				user.lastName = data.lastName;
			}
			if(data.phone !== undefined)
			{
				user.phone = data.phone;
			}
		
			user.timestamp = timestamp();

			user.save(function(err, reqData)
			{
				user = reqData;

				user = user.toObject();

				user.count = {
					following : user.following.length,
					followers : user.followers.length
				}

				delete user.following;
				delete user.followers;
				delete user.password;
				delete user.__v;

				callback();
			});
		}

	], function(invalid)
	{
		if(!invalid)
			response = user;

		res.status(status).send(response);
	});

}

/*
 * [GET] GET FOLLOWING USERS
 * (need to be authed) 
 *
 * @return Users data
 */
exports.getFollowing = function(req, res) {
	
	var response = {};
	var status = 200; //200

	var user,
		following;

	async.series([

		function(callback)
		{
			auth.isAuthenticated(req, function(reqData)
			{
				user = reqData;

				if(user == null)
				{
					response.code = 10;
					status = 401
					callback(true);
				}
				else
				{
					callback();
				}
			});
		},
		function(callback)
		{
			user
			.populate('following',userModel.onlyPublicSimple(), function(err, reqData)
			{
				following = reqData.following;

				callback();
			});
		}

	], function(invalid)
	{
		if(!invalid)
			response = following;

		res.status(status).send(response);
	});

}

/*
 * [GET] GET FOLLOWERS
 * (need to be authed) 
 *
 * @return Users data
 */
exports.getFollowers = function(req, res) {
	
	var response = {};
	var status = 200; //200

	var user,
		followers;

	async.series([

		function(callback)
		{
			auth.isAuthenticated(req, function(reqData)
			{
				user = reqData;

				if(user == null)
				{
					response.code = 10;
					status = 401
					callback(true);
				}
				else
				{
					callback();
				}
			});
		},
		function(callback)
		{
			user
			.populate('followers',userModel.onlyPublicSimple(), function(err, reqData)
			{
				followers = reqData.followers;

				callback();
			});
		}

	], function(invalid)
	{
		if(!invalid)
			response = followers;

		res.status(status).send(response);
	});

}

/*
 * [POST] AUTH A USER
 *
 * @param String email
 * @param String password
 * @return User data
 */
exports.auth = function(req, res) {

	var data = req.body;

	var response = {};
	var status = 200; //200

	var user;

	async.series([
		function(callback)
		{
			if(data.email === undefined)
			{
				response.code = 1;
				status = 400; //400
				callback(true);
			}
			else if(data.password === undefined)
			{
				response.code = 2;
				status = 400; //400
				callback(true);
			}
			else
			{
				callback();
			}
		},
		function(callback)
		{
			User.findOne({ email : data.email }).exec(function(err, reqData)
			{
				user = reqData;

				if(user == null
				|| user === undefined)
				{
					response.code = 11;
					status = 422; //422
					callback(true);
				}
				else if(!bcrypt.compareSync(data.password, user.password))
				{
					response.code = 12;
					status = 422; //422
					callback(true);
				}
				else
				{
					callback();
				}
			});
		},
		function(callback)
		{
			var timestamp = (new Date().getTime()).toString();

			user.authenticationToken = bcrypt.hashSync(timestamp+user.email,12);

			user.save(function(err, reqData)
			{
				user = reqData;

				user
				.populate('following followers', userModel.onlyPublicSimple(),
					function(err, retData)
					{
						user = reqData;

						callback();
					}
				);
			});
		}
	], function(invalid)
	{
		if(!invalid)
			response = user;

		res.status(status).send(response);
	});

}

/*
 * [GET] UNAUTH A USER
 */
exports.unAuth = function(req, res) {

	var response = {};
	var status = 200; //200

	var user;

	async.series([
		function(callback)
		{
			auth.isAuthenticated(req, function(reqData)
			{
				user = reqData;

				if(user == null)
				{
					response.code = 13;
				}
				
				callback();
			});
		},
		function(callback)
		{
			var timestamp = (new Date().getTime()).toString();

			user.authenticationToken = bcrypt.hashSync(timestamp+user.email,12);

			user.save(function(err, user)
			{
				response.code = 13;

				callback();
			});
		}
	], function()
	{
		res.status(status).send(response);
	});
}

/*
 * [GET] GET CURRENT USER
 * (user need to be authed)
 *
 * @return User me
 */
exports.findMe = function(req, res) {

	var response = {};
	var status = 200; //200

	auth.isAuthenticated(req, function(user)
	{
		if(user == null)
		{
			response.code = 10;
			status = 401; //401
		}
		else
		{
			response = user;

			response = response.toObject();

			response.count = {
				following : response.following.length,
				followers : response.followers.length
			}

			delete response.following;
			delete response.followers;
			delete response.password;
			delete response.__v;
		}

		res.status(status).send(response);
	});
   
};

/*
 * [GET] FIND A USER BY ID
 *
 * @param String _id
 * @return User data
 */
exports.findById = function(req, res) {

    var id = req.params.id;

    User
    .findOne({_id : id})
    .select(userModel.onlyPublic())
    .lean()
    .exec(function(err, user)
    {
        if(user != null)
        {
			user.count = {
				following : user.following.length,
				followers : user.followers.length
			}

			delete user.following;
			delete user.followers;
			delete user.password;
			delete user.__v;

            res.send(user);
        }
        else
        {
            var response = {};

            response.code = 11;
            res.status(422).send(response);
        }
    });
};

/*
 * [GET] FIND FOLLOWING BY USER ID
 *
 * @param String _id
 * @return User data
 */
exports.followingById = function(req, res) {

    var id = req.params.id;
    var response;

    User
    .findOne({_id : id})
    .select('following')
    .populate('following')
    .lean()
    .exec(function(err, user)
    {
        if(user != null)
        {
			for(var i in user.following)
			{
				user.following[i].count = {
					following : user.following[i].following.length,
					followers : user.following[i].followers.length
				}

				delete user.following[i].following;
				delete user.following[i].followers;
				delete user.following[i].__v;
				delete user.following[i].password;
				delete user.following[i].authenticationToken;
			}

            res.send(user.following);
        }
        else
        {
            response = {};

            response.code = 11;
            res.status(422).send(response);
        }
    });
};

/*
 * [GET] FIND FOLLOWERS BY USER ID
 *
 * @param String _id
 * @return User data
 */
exports.followersById = function(req, res) {

    var id = req.params.id;
    var response;

    User
    .findOne({_id : id})
    .select('followers')
    .populate('followers')
    .lean()
    .exec(function(err, user)
    {
        if(user != null)
        {
			for(var i in user.followers)
			{
				user.followers[i].count = {
					following : user.followers[i].following.length,
					followers : user.followers[i].followers.length
				}

				delete user.followers[i].following;
				delete user.followers[i].followers;
				delete user.followers[i].__v;
				delete user.followers[i].password;
				delete user.followers[i].authenticationToken;
			}

            res.send(user.followers);
        }
        else
        {
            response = {};

            response.code = 11;
            res.status(422).send(response);
        }
    });
};

/*
 * [POST] FIND A USER BY EMAIL
 *
 * @param String query
 * @return User data
 */
exports.find = function(req, res) {

	var data        = req.body,
		response    = {},
		status      = 200;

	var users;

	async.series([
		function(callback)
		{
			if(data.query === undefined)
			{
				response.code = 24; //Missing parameter 'query'
				status = 400;
				callback(true);
			}
			else
			{
				callback();
			}
		},
		function(callback)
		{
			User
			.find({ 
				$or : [
					{
						email : new RegExp(data.query, 'i')
					},
					{
						username : new RegExp(data.query, 'i')
					},
					{
						firstName : new RegExp(data.query, 'i')
					},
					{
						lastName : new RegExp(data.query, 'i')
					},
					{
						phone : new RegExp(data.query, 'i')
					}
				]
			})
    		.select(userModel.onlyPublic())
			.lean()
			.exec(function(err, retData)
			{
				users = retData;

				for(var i in users)
				{
					users[i].count = {
						following : users[i].following.length,
						followers : users[i].followers.length
					}

					delete users[i].following;
					delete users[i].followers;
					delete users[i].__v;
				}

				callback();
			});
		}
	], function(invalid)
	{
		if(!invalid)
			response = users;

		res.status(status).send(response);
	});
}
 
/*
 * [GET] FIND ALL USERS
 *=
 * @return Users data
 */
exports.findAll = function(req, res) {

    User.find().exec(function (err, users) {
        if(err)
        {
            res.status(400).send("Error");
        }
        else
        {
            res.send(users);
        }
    });
};
 
/*
 * [POST] CREATE A NEW USER
 *
 * @param String email
 * @param String password
 * @return User data
 */
exports.addUser = function(req, res) {

    var data        = req.body,
        response    = {},
        status      = 200;

    var newUser,
    	user;

	async.series([
		function(callback)
		{
		    if(data.email === undefined)
		    {
		        response.code = 1;
		        callback(true);
		    }
		    else if(data.password === undefined)
		    {
		        response.code = 2;
		        callback(true);
		    }
		    else
		    {
		    	callback();
		    }
		},
		function(callback)
		{
		    User
		    .findOne({ email : data.email })
		    .exec(function(err, retData)
		    {
	            if(retData === null)
	            {
	                data.password = bcrypt.hashSync(data.password, 12);

					var token = bcrypt.hashSync(timestamp()+data.email,12);

	                newUser = new User({
	                    email : data.email,
	                    password : data.password,
	                    timestamp : timestamp(),
	                    authenticationToken : token
	                });

	                callback();
	            }
	            else
	            {
	                response.code = 9;
	                status = 422;
					callback(true);
				}
		    });
		},
		function(callback)
		{
	        newUser.save(function(err, retData)
	        {
	        	user = retData;

	        	callback();
	        });
		}
	], function(invalid)
	{
		if(!invalid)
			response = user;

		res.status(status).send(response);
	});
}

exports.deleteAll = function(req, res) {

    User.find(function (err, users) {
        
        for(var i in users)
        {
            users[i].remove();
        }

    });

}

/*
 * [PUT] UPDATE A USER
 *
 * @param String email OPT
 * @param String password OPT
 * @return User data
 */
exports.updateUser = function(req, res) {

    var id = req.params.id;
    var user = req.body;

    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));

    db.collection('user', function(err, collection) {

        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, oldUser) {
            
            var invalid = false;
            var response = {};

            if(user.email === undefined)
            {
                user.email = oldUser.email;
            }
            if(user.changePassword === undefined)
            {
                user.password = oldUser.password;
            }
            else
            {
                if(user.oldPassword === undefined)
                {
                    response.code = "Need old password!";
                    callback(true);
                }
                else if(!bcrypt.compareSync(user.oldPassword, oldUser.password))
                {
                    response.code = "Old password incorrect!";
                    callback(true);
                }
                else
                {
                    if(user.newPassword === undefined || user.newPassword == "")
                    {
                        response.code = "Need a new password!";
                        callback(true);
                    }
                    else
                    {
                        user.password = bcrypt.hashSync(user.newPassword, 12);
                    }
                }
            }

            if(invalid)
            {
                res.status(400).send(response);
                console.log('Error: invalid request "'+JSON.stringify(response).error+'"');
            }
            else
            {
                oldUser.email    = user.email;
                oldUser.password = user.password;

                collection.update({'_id':new BSON.ObjectID(id)}, oldUser, {safe:true}, function(err, result) {
                    if (err) {
                        console.log('Error updating user: ' + err);
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('' + result + ' document(s) updated');
                        res.send(oldUser);
                    }
                });
            }
        });

    });
}
 
/*
 * [DELETE] DELETE A USER
 *
 * @param String _id
 * @param String password
 */
exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('user', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
