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

/*
 * [POST] ADD A NEW FRIEND
 * (need to be authed) 
 *
 * @param String email
 * @return Friend data
 */
exports.addFriend = function(req, res) {

	var data = req.body;

	var response = {};
	var status = 200; //200

	var user,
	friendUser;

	async.series([

		function(callback)
		{
			auth.isAuthenticated(req, function(reqData)
			{
				user = reqData;

				if(user == null)
				{
					response.code = 10;
					status = 200; //401
					callback(true);
				}
				else if(data._id === undefined)
				{
					response.code = 3;
					status = 200; //400
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
				friendUser = reqData;

				if(friendUser == null
				|| friendUser === undefined)
				{
					response.code = 11;
					status = 200; //422
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
			if(user.friends.indexOf(data._id) != -1)
			{
				response.code = 14;
				status = 422
				callback(true);
			}
			else
			{
				user.friends.push(friendUser);

				user.save(function(err, reqData)
				{
					user = reqData;

					friendUser.friends.push(user);

					callback();
				});
			}
		},
		function(callback)
		{
			friendUser.save(function(err, reqData)
			{
				user.populate('friends', '-friends', function(err, reqData)
				{
					user = reqData;

					callback();
				});
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
 * [GET] GET USER FRIENDS
 * (need to be authed) 
 *
 * @return Friends data
 */
exports.getFriends = function(req, res) {
	
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
					response.code = 10;
					status = 401
					callback(true);
				}

				user.populate('friends','-friends -authenticationToken', function(err, reqData)
				{
					user = reqData;

					callback();
				});

			});
		},

	], function(invalid)
	{
		if(!invalid)
			response = user;

		res.status(status).send(response);
	});

}

/*
 * [POST] AUTH A USER
 *
 * @param String email
 * @param String password
 * @return Friends data
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
				status = 200; //400
				callback(true);
			}
			else if(data.password === undefined)
			{
				response.code = 2;
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
			User.findOne({ email : data.email }).exec(function(err, reqData)
			{
				user = reqData;

				if(user == null
				|| user === undefined)
				{
					response.code = 11;
					status = 200; //422
					callback(true);
				}
				else if(!bcrypt.compareSync(data.password, user.password))
				{
					response.code = 12;
					status = 200; //422
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

				user.populate('friends', '-authenticationToken -__v -password -friends',
					function(err, retData)
					{
						user = reqData;

						user = user.toObject();

						delete user.password;
						delete user.__v;

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
			status = 200; //401
		}
		else
		{
			response = user;
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

    User.findOne({_id : id},'-friends', function(err, user)
    {
        if(user != null)
        {
            res.send(user.noToken());
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
 * [POST] FIND A USER BY EMAIL
 *
 * @param String email
 * @return User data
 */
exports.find = function(req, res) {

    var data        = req.body,
        invalid     = false,
        response    = {},
        status      = 400;

    if(data.email === undefined)
    {
        response.code = 1;
        callback(true);
    }

    if(invalid)
    {
        res.status(status).send(response);
        console.log('Error: invalid request "'+JSON.stringify(response)+'"');
    }
    else
    {
        User.find({ email : new RegExp(data.email, 'i') },'-friends -authenticationToken', function(err, user)
        {
            if(user == null)
            {
                response.code = 11;
                res.status(422).send(response);
            }
            else
            {
                res.send(user);
            }
        });
    }
}
 
/*
 * [GET] FIND ALL USERS
 *=
 * @return Users data
 */
exports.findAll = function(req, res) {

    User.find().select("-authenticationToken").exec(function (err, users) {
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

    var user        = req.body,
        invalid     = false,
        response    = {},
        status      = 400;

    if(user.email === undefined)
    {
        response.code = 1;
        callback(true);
    }
    else if(user.password === undefined)
    {
        response.code = 2;
        callback(true);
    }

    User.findOne({ email : user.email }).exec(function(err, check)
    {
        if(invalid)
        {
            res.status(status).send(response);
            console.log('Error: invalid request "'+JSON.stringify(response)+'"');
        }
        else
        {
            if(check === null)
            {
                user.password = bcrypt.hashSync(user.password, 12);

                var newUser = new User({
                    email : user.email,
                    password : user.password
                });

                newUser.save(function(err, data)
                {
                    res.status(200).send(data.noToken());
                });
            }
            else
            {
                response.code = 9;
                status = 200; //422

                res.status(status).send(response);
                console.log('Error: invalid request "'+JSON.stringify(response)+'"');
            }
        }
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
