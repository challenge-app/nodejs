/*
 * EXTENSIONS
 */
var bcrypt          = require('bcrypt'),
    async           = require('async'),
    auth            = require('../config/auth'),
    userModel       = require('../models/user'),
    challengeModel  = require('../models/challenge'),
    likeDoubtModel  = require('../models/like_doubt'),
    feedModel       = require('../models/feed');

/*
 * MODELS
 */
var User            = userModel.getUserModel(),
    Challenge       = challengeModel.getChallenge(),
    ChallengeBase   = challengeModel.getChallengeBase(),
    LikeDoubt       = likeDoubtModel.getLikeDoubtModel(),
    Feed            = feedModel.getFeedModel();

var timestamp = (new Date().getTime()).toString();

/*
 * [GET] RETURN THE FEED
 * (need to be authed) 
 *
 * @param  Number limit
 * @param  Number offset
 * @return Feed[] data
 */

function myChallenges(user, callback)
{
    Challenge
    .find({
        $or : [
            { sender : user._id },
            { receiver : user._id },
            { sender : { $in : user.friends } },
            { receiver : { $in : user.friends } }
        ]
    })
    .sort('-timestamp')
    .exec(function(err, retData)
    {
        callback(retData);
    });
}

exports.getMyFeed = function(req, res) {

    var data = req.query;
    var response = {};
    var status = 200; //200

    var feed;

    var user;

    async.series([

        function(callback)
        {
            auth.isAuthenticated(req, function(retData)
            {
                user = retData;

                if(user == null)
                {
                    response.code = 10;
                    status = 401;
                    callback(true);
                }
                else if(data.limit === undefined)
                {
                    response.code = 25;
                    status = 400;
                    callback(true);
                }
                else if(data.offset === undefined)
                {
                    response.code = 26;
                    status = 400;
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
            feed = [];
        
            myChallenges(user, function(retData)
            {
                var toAdd;

                for(var i in retData)
                {
                    toAdd = new Feed({
                        challenge : retData[i]._id,
                    });

                    if(retData[i].status <= 0)
                    {
                        toAdd.whatHappened = 0;
                    }
                    else if(retData[i].status == 1 || retData[i].status == 2)
                    {
                        toAdd.whatHappened = retData[i].status;
                    }

                    feed.push(toAdd);
                }

                callback();
            });
        }
    ], function(invalid)
    {
        if(!invalid)
            response = feed;

        res.status(status).send(response);
    });
}
