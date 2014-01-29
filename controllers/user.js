/*
 * EXTENSIONS
 */
var bcrypt      = require('bcrypt'),
    auth        = require('../config/auth'),
    userModel   = require('../models/user');

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
    var invalid = false;
    var status = 400;

    auth.isAuthenticated(req, function(user)
    {
        if(user == null)
        {
            response.error = "Please sign in!";
            invalid = true;
            status = 401;
        }
        else if(data._id === undefined)
        {
            response.error = "Give me an id!";
            invalid = true;
            status = 400;
        }

        if(invalid)
        {
            res.status(status).send(response);
            console.log('Error: invalid request "'+JSON.stringify(response)+'"');
        }
        else
        {
            User.findOne({ _id : data._id }).exec(function(err, friendUser)
            {
                if(friendUser === null)
                {
                    response.error = "User not found!";

                    res.status(422).send(response);
                    console.log('Error: invalid request "'+JSON.stringify(response)+'"');
                }
                else
                {
		    if(user.friends.indexOf(data._id) != -1)
		    {
			response.error = "He is already your friend";
			
			res.status(422).send(response);
		    }
		    else
		    {
                    user.friends.push(friendUser);

                    user.save(function(err, user)
                    {
                        friendUser.friends.push(user);

                        friendUser.save(function(err, ignore)
                        {
                            user.populate({ path: 'friends', select: '-friends' }, function(err, user)
                            {
                                res.send(user);
                            });
                        });
                    });
			    }
		}
            });
        }
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
    var invalid = false;
    var status = 400;

    auth.isAuthenticated(req, function(user)
    {
        if(user == null)
        {
            response.error = "Please sign-in!";
            status = 401
            invalid = true;
        }

        if(invalid)
        {
            res.status(status).send(response);
            console.log('Error: invalid request "'+JSON.stringify(response)+'"');
        }
        else
        {
            user.populate('friends','-friends -authenticationToken', function(err, user)
            {
                user.noToken();
                res.send(user);
            });
        }

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

    var user = req.body;

    if(user.email === undefined)
    {
        var response = {};

        response.error = "Give me an email!";

        res.status(400).send(response);
    }

    User.findOne({ email : user.email }).exec(function(err, item)
    {

        var response = {};
        var invalid = false;
        var status = 400;

        if(item === null)
        {
            response.error = "User not found!";
            status = 422;
            invalid = true;
        }
        else if(user.password === undefined)
        {
            response.error = "Need a password!";
            invalid = true;
        }
        else if(!bcrypt.compareSync(user.password, item.password))
        {
            response.error = "Password incorrect!";
            invalid = true;
        }

        if(invalid)
        {
            res.status(status).send(response);
            console.log('Error: invalid request "'+JSON.stringify(response)+'"');
        }
        else
        {
            var timestamp = (new Date().getTime()).toString();

            item.authenticationToken = bcrypt.hashSync(timestamp+item.email,12);

            item.save(function(err, item)
            {
                var respItem = {};
		respItem._id = item._id;
		respItem.authenticationToken = item.authenticationToken;
		respItem.email = item.email;
		res.send(respItem);
            });
        }

    });

}

/*
 * [GET] UNAUTH A USER
 */
exports.unAuth = function(req, res) {

    var response = {};
    var alreadyOut = false;

    auth.isAuthenticated(req, function(user)
    {
        if(user == null)
        {
            response.message = "You are already out!";
            res.status(200).send(response);
        }
        else
        {
            var timestamp = (new Date().getTime()).toString();

            user.authenticationToken = bcrypt.hashSync(timestamp+user.email,12);

            user.save(function(err, user)
            {
                response.message = "You are out!";
                res.status(200).send(response);
            });
        }
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

    auth.isAuthenticated(req, function(user)
    {
        if(user == null)
        {
            response.error = "Please sign-in!";
            res.status(401).send(response);
        }
        else
        {
            res.send(user.noToken());
        }
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

            response.error = "User not found!";
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
        response.error = "I need an email!";
        invalid = true;
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
                response.error = "User not found!";
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
        response.error = "I need an email!";
        invalid = true;
    }
    else if(user.password === undefined)
    {
        response.error = "I need a password!";
        invalid = true;
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
                response.error = "User already exists!";
                status = 422;

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
                    response.error = "Need old password!";
                    invalid = true;
                }
                else if(!bcrypt.compareSync(user.oldPassword, oldUser.password))
                {
                    response.error = "Old password incorrect!";
                    invalid = true;
                }
                else
                {
                    if(user.newPassword === undefined || user.newPassword == "")
                    {
                        response.error = "Need a new password!";
                        invalid = true;
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
