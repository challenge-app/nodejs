var mongo       = require('mongodb'),
    bcrypt      = require('bcrypt'),
    mongoose    = require('mongoose'),
    userModel   = require('../models/user.js'),
    friendModel = require('../models/friend.js');

var User    = userModel.getUserModel(),
    Friend  = friendModel.getFriendModel();

mongoose.connect('mongodb://localhost/challenge');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
    console.log('LOAD: Mongoose!');
});

exports.addFriend = function(req, res) {

    var user = req.body;

    var response = {};
    var invalid = false;
    var status = 400;

    if(req.session.user === undefined)
    {
        response.error = "unauthorized";
        invalid = true;
        status = 401;
    }
    else if(user._id === undefined)
    {
        response.error = "Give me an id!";
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
        User.findOne({ _id : user._id }).exec(function(err, friend)
        {
            if(friend === null)
            {
                response.error = "User not found!";

                res.status(422).send(response);
                console.log('Error: invalid request "'+JSON.stringify(response)+'"');
            }
            else
            {
                Friend.findOne({ userId : req.session.user._id }).exec(function(err, hisFriends)
                {
                    if(hisFriends === null)
                    {
                        var add = new Array();

                        add.push(friend._id);

                        var hisFriends = new Friend({
                            userId : req.session.user._id,
                            friends : add
                        });

                        hisFriends.save(function(err, data)
                        {
                            res.send(data);
                        });
                    }
                    else
                    {
                        hisFriends.friends.push(friend._id);

                        hisFriends.save(function(err, data)
                        {
                            res.send(data);
                        });
                    }
                });
            }
        });
    }

}

exports.getFriends = function(req, res) {

    var response = {};
    var invalid = false;
    var status = 400;

    if(req.session.user === undefined)
    {
        response.error = "unauthorized";
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
            item.password = "protected";

            req.session.user = item;
            res.send(item);
        }

    });

}

exports.unAuth = function(req, res) {

    var response = {};

    req.session.user = undefined;

    response.message = "You are out!";

    res.status(200).send(response);
}

exports.findMe = function(req, res) {

    var response = {};
    var invalid = false;

    if(req.session.user === undefined)
    {
        response.error = "unauthorized";
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

exports.findById = function(req, res) {

    var id = req.params.id;
    console.log('Retrieving user: ' + id);

    User.findOne({_id : id}, function(err, user)
    {
        if(user != null)
        {
            user.password = "protected";
        }

        res.send(user);
    });
};

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
                    res.status(200).send(data);
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

/*
exports.addUser = function(req, res) {

    var user = req.body;
    console.log('Adding user: ' + JSON.stringify(user));

    db.collection('user', function(err, collection) {

        var status = 400;
        var invalid = false;
        var response = {};

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

        collection.findOne({ email : user.email }, function(err, item) {

            if(item !== null)
            {
                response.error = "User already exists!";
                status = 422;
                invalid = true;
            }

            if(invalid)
            {
                res.status(status).send(response);
                console.log('Error: invalid request "'+JSON.stringify(response)+'"');
            }
            else
            {
                user.password = bcrypt.hashSync(user.password, 12);

                collection.insert(user, {safe:true}, function(err, result) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('Success: ' + JSON.stringify(result[0]));
                        res.send(result[0]);
                    }
                });
            }

        });
    });
}
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

var populateDB = function() {
 
    var user = [
    {
        email: "mcgiordalp@gmail.com",
        password: bcrypt.hashSync("6uwgqj9w", 12)
    }];
 
    db.collection('user', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {});

        console.log(user);
    });
 
};
