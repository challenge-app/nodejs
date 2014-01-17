/*
 * EXTENSIONS
 */
var bcrypt          = require('bcrypt'),
    auth            = require('../config/auth'),
    userModel       = require('../models/user'),
    friendModel     = require('../models/friend'),
    challengeModel  = require('../models/challenge');

/*
 * MODELS
 */
var User            = userModel.getUserModel(),
    Friend          = friendModel.getFriendModel(),
    Challenge       = challengeModel.getChallenge(),
    ChallengeBase   = challengeModel.getChallengeBase();

/*
 * [POST] CREATE A CHALLENGE
 * (need to be authed) 
 *
 * @param String receiverId
 * @param String reward
 * @param String description
 * @return Mixed(Challenge + ChallengeBase) data
 */
exports.newChallenge = function(req, res) {

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
        else if(data.receiverId === undefined)
        {
            response.error = "Give me an receiverId!";
            invalid = true;
            status = 400;
        }
        else if(data.description === undefined)
        {
            response.error = "Give me a description!";
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
            if(data.receiverId == user._id)
            {
                response.error = "You can't challenge yourself!";
                status = 422;
                res.status(status).send(response);
            }
            else
            {
                User.findOne({_id : data.receiverId}, function(err, challenged)
                {
                    if(challenged == null)
                    {
                        response.error = "User not found!";
                        status = 422;
                        res.status(status).send(response);
                    }
                    else
                    {
                        if(!user.hasFriend(challenged._id))
                        {
                            response.error = "You need to be his friend!";
                            status = 422;
                            res.status(status).send(response);
                        }
                        else
                        {
                            var challBase = new ChallengeBase({
                                description : data.description,
                                generalVotes : 0
                            });

                            challBase.save(function(err, challBase)
                            {
                                if(!(data.reward > 0)) data.reward = 0;

                                var chall = new Challenge({
                                    info: challBase._id,
                                    sender: user._id,
                                    receiver: challenged._id,
                                    reward: data.reward,
                                    votes: 0
                                });

                                chall.save(function(err, chall)
                                {
                                    chall.populate('info').populate('sender').populate('receiver', function(err, chall)
                                    {
                                                res.send(chall);
                                    });
                                });
                            });
                        }
                    }
                });
            }
        }
    });

}

/*
 * [GET] CHALLENGES I'VE BEEN CHALLENGED
 * (need to be authed) 
 *
 * @return Mixed(Challenge + ChallengeBase) data
 */
exports.challengesReceived = function(req, res) {

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

        if(invalid)
        {
            res.status(status).send(response);
            console.log('Error: invalid request "'+JSON.stringify(response)+'"');
        }
        else
        {
            Challenge.find({ receiver : user._id }).populate('info').populate('sender').populate('receiver').exec(function(err, challenges)
            {
                res.send(challenges);
            });
        }
    });

}

/*
 * [GET] CHALLENGES I'VE SENT
 * (need to be authed) 
 *
 * @return Mixed(Challenge + ChallengeBase) data
 */
exports.challengesSent = function(req, res) {

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

        if(invalid)
        {
            res.status(status).send(response);
            console.log('Error: invalid request "'+JSON.stringify(response)+'"');
        }
        else
        {
            Challenge.find({ sender : user._id }).populate('info').populate('sender','-friends').populate('receiver','-friends').exec(function(err, challenges)
            {
                res.send(challenges);
            });
        }
    });

}
