/*
 * EXTENSIONS
 */
var bcrypt          = require('bcrypt'),
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

    if(req.session.user === undefined)
    {
        response.error = "Please sign-in!";
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
                var chalBase = new ChallengeBase({
                    description : data.description,
                    votes : 0
                });

                chalBase.save(function(err, chalBase)
                {
                    if(!(data.reward > 0)) data.reward = 0;

                    var chal = new Challenge({
                        senderId: req.session.user._id,
                        receiverId: challenged._id,
                        challengeBaseId: chalBase._id,
                        reward: data.reward
                    });

                    chal.save(function(err, chal)
                    {
                        var returnData = {};

                        returnData.senderId = chal.senderId;
                        returnData.receiverId = chal.receiverId;
                        returnData.challengeBaseId = chal.challengeBaseId;
                        returnData.reward = chal.reward;
                        returnData.description = data.description;
                        returnData.votes = 0;

                        res.send(returnData);
                    });
                });
            }
        });
    }

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
        Challenge.find({ receiverId : req.session.user._id }, function(err, challenges)
        {
            res.send(challenges);
        });
    }

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
        Challenge.find({ senderId : req.session.user._id }, function(err, challenges)
        {
            res.send(challenges);
        });
    }

}