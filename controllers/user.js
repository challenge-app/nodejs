/*
 * EXTENSIONS
 */
var mongo       = require('mongodb'),
    bcrypt      = require('bcrypt'),
    mongoose    = require('mongoose'),
    userModel   = require('../models/user'),
    friendModel = require('../models/friend');

/*
 * MODELS
 */
var User    = userModel.getUserModel(),
    Friend  = friendModel.getFriendModel();

/*
 * DATABASE SETUP
 */
mongoose.connect('mongodb://localhost/challenge');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
    console.log('LOAD: Mongoose!');
});

/*
 * [POST] ADD A NEW FRIEND
 * (need to be authed) 
 *
 * @param String email
 * @return Friend data
 */
exports.addFriend = function(req, res) {

    var user = req.body;

    var response = {};
    var invalid = false;
    var status = 400;

    if(req.session.user === undefined)
    {
        response.error = "Please sign-in!";
        invalid = true;
        status = 401;
    }
    else if(user._id === undefined)
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
        User.findOne({ _id : user._id }).exec(function(err, friendUser)
        {
            if(friendUser === null)
            {
                response.error = "User not found!";

                res.status(422).send(response);
                console.log('Error: invalid request "'+JSON.stringify(response)+'"');
            }
            else
            {
                Friend.findOne({ userId : req.session.user._id }).exec(function(err, currUserFriends)
                {
                    currUserFriends.friends.push(friendUser._id);

                    currUserFriends.save(function(err, data)
                    {
                        Friend.findOne({ userId : friendUser._id }).exec(function(err, friendUserFriends)
                        {
                            friendUserFriends.friends.push(req.session.user._id);

                            friendUserFriends.save(function(err, data2)
                            {
                                res.send(data);
                            });
                        });
                    });
                });
            }
        });
    }

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

    if(req.session.user === undefined)
    {
        response.error = "Please sign-in!";
        invalid = true;
        status = 401;
    }

    if(invalid)
    {
        res.status(status).send(response);
        console.log('Error: invalid request "'+JSON.stringify(response)+'"');
    }
    else
    {
        Friend.findOne({userId : req.session.user._id}, function(err, data)
        {
            if(data === null)
            {
                res.send(null);
            }
            else
            {
                User.where('_id').in(data.friends).exec(function(err, users)
                {
                    if(users === null)
                    {
                        res.send({});
                    }
                    else
                    {
                        for(var i in users)
                        {
                            users[i].password = "protected";
                        }

                        res.send(users);
                    }
                });
            }
        });
    }

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

    console.log(user);

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
            item.password = "protected";

            req.session.user = item;
            res.send(item);
        }

    });

}

/*
 * [GET] UNAUTH A USER
 */
exports.unAuth = function(req, res) {

    var response = {};

    req.session.user = undefined;

    response.message = "You are out!";

    res.status(200).send(response);
}

/*
 * [GET] GET CURRENT USER
 * (user need to be authed)
 *
 * @return User me
 */
exports.findMe = function(req, res) {

    var response = {};
    var invalid = false;

    if(req.session.user === undefined)
    {
        response.error = "Please sign-in!";
        invalid = true;
    }

    if(invalid)
    {
        res.status(401).send(response);
        console.log('Error: invalid request "'+JSON.stringify(response)+'"');
    }
    else
    {
        res.send(req.session.user);
    }
   
};

/*
 * [GET] FIND A USER BY ID
 *
 * @param String _id
 * @return User data
 */
exports.findById = function(req, res) {

    var id = req.params.id;
    console.log('Retrieving user: ' + id);

    User.findOne({_id : id}, function(err, user)
    {
        if(user != null)
        {
            user.password = "protected";

            res.send(user);
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
        User.findOne({ email : data.email }, function(err, user)
        {
            if(user == null)
            {
                response.error = "User not found!";
                res.status(422).send(response);
            }
            else
            {
                user.password = "protected";
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

    User.find(function (err, users) {
        if(err)
        {
            res.status(400).send("Error");
        }
        else
        {
            res.status(200).send(users);
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
                    var ff = new Array();

                    var newFriends = new Friend({
                        userId : data._id,
                        friends : ff
                    });

                    newFriends.save(function(err, data2)
                    {
                        data.password = "protected";
                        res.status(200).send(data);
                    });
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
