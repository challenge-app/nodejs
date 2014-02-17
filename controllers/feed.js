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


exports.getMyFeed = function(req, res) {

    var data = req.query;
    var response = {};
    var status = 200; //200

    var feed = [];

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
            Feed
            .find({
                $or : [
                    { users : user._id },
                    { users : { $in : user.following } }
                ]
            })
            .skip(data.offset)
            .limit(data.limit)
            .populate('challenge')
            .populate('culprit', 'username firstName email')
            .populate('whoElse', 'username firstName email')
            .select('-users -notify -seen')
            .sort('-timestamp')
            .exec(function(err, retData)
            {
                var options = [{
                    path: 'challenge.info',
                    model: 'ChallengeBase',
                    select: '-challenges -def -difficulty'
                },
                {
                    path: 'challenge.sender',
                    model: 'User',
                    select: 'username firstName email timestamp'
                },
                {
                    path: 'challenge.receiver',
                    model: 'User',
                    select: 'username firstName email timestamp'
                }];

                Feed
                .populate(retData, options, function(err, retData)
                {
                    feed = retData;

                    callback();
                });
            });
        }
    ], function(invalid)
    {
        if(!invalid)
            response = feed;

        res.status(status).send(response);
    });
}
