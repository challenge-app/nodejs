/*
 * EXTENSIONS
 */
var bcrypt          = require('bcrypt'),
    async           = require('async'),
    auth            = require('../config/auth'),
    userModel       = require('../models/user'),
    challengeModel  = require('../models/challenge'),
    likeDoubtModel  = require('../models/like_doubt');

/*
 * MODELS
 */
var User            = userModel.getUserModel(),
    Challenge       = challengeModel.getChallenge(),
    ChallengeBase   = challengeModel.getChallengeBase(),
    LikeDoubt       = likeDoubtModel.getLikeDoubtModel();

var timestamp = (new Date().getTime()).toString();

/*
 * [POST] CREATE A CHALLENGE
 * (need to be authed) 
 *
 * @param String receiverId
 * @param String reward
 * @param String type
 * @param String description
 * @return Mixed(Challenge + ChallengeBase) data
 */
exports.newChallenge = function(req, res) {

    var data = req.body;

    var response = {};
    var status = 200;

    var user,
        challenged,
        challBase,
        chall;

    async.series([

        function(callback)
        {
            auth.isAuthenticated(req, function(retData)
            {
                user = retData;

                if(user == null)
                {
                    response.error = "Please sign in!";
                    status = 401;
                    callback(true);
                }
                else if(data.receiverId === undefined)
                {
                    response.error = "Give me an receiverId!";
                    status = 400;
                    callback(true);
                }
                else if(data.description === undefined)
                {
                    response.error = "Give me a description!";
                    status = 400;
                    callback(true);
                }
                else if(data.type === undefined)
                {
                    response.error = "Give me a type!";
                    status = 400;
                    callback(true);
                }
                else if(data.type != "video"
                     && data.type != "picture")
                {
                    response.error = "I accept only 'video' and 'picture' as a type!";
                    status = 422;
                    callback(true);
                }
                else if(data.receiverId == user._id)
                {
                    response.error = "You cannot challenge yourself!";
                    status = 422;
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
            User.findOne({_id : data.receiverId}, function(err, retData)
            {
                challenged = retData;

                if(challenged == null)
                {
                    response.error = "User not found!";
                    status = 422;
                    callback(true);
                }
                else if(!user.hasFriend(challenged._id))
                {
                    response.error = "You need to be his friend!";
                    status = 422;
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
            challBase = new ChallengeBase({
                description : data.description,
                generalLikes : 0,
                timestamp : timestamp
            });

            challBase.save(function(err, retData)
            {
                challBase = retData;

                callback();
            });
        },
        function(callback)
        {
            if(!(data.reward > 0)) data.reward = 0;
            
            chall = new Challenge({
                info: challBase._id,
                sender: user._id,
                receiver: challenged._id,
                status: -1,
                url: "",
                type: data.type,
                reward: data.reward,
                likes: 0,
                doubts: 0,
                timestamp : timestamp
            });

            chall.save(function(err, retData)
            {
                chall = retData;

                chall
                .populate('info', '-challenges')
                .populate('sender', '-friends')
                .populate('receiver', '-friends', function(err, retData)
                {
                    chall = retData;

                    callback();
                });
            });
        }
    ], function(invalid)
    {
        if(!invalid)
            response = chall;

        res.status(status).send(response);
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
    var status = 200;

    var user,
        challenges;

    async.series([

        function(callback)
        {
            auth.isAuthenticated(req, function(retData)
            {
                user = retData;

                if(user == null)
                {
                    response.error = "Please sign in!";
                    callback(true);
                    status = 401;
                }
                else
                {
                    callback();
                }
            });
        },
        function(callback)
        {
            Challenge
            .find({ receiver : user._id })
            .sort('-timestamp')
            .populate('info', '-challenges')
            .populate('sender', '-friends')
            .populate('receiver', '-friends')
            .exec(function(err, retData)
            {
                challenges = retData;

                callback();
            });
        }
    ], function(invalid)
    {
        if(!invalid)
            response = challenges;

        res.status(status).send(response);
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
    var status = 200;

    var user,
        challenges;

    async.series([

        function(callback)
        {
            auth.isAuthenticated(req, function(retData)
            {
                user = retData;

                if(user == null)
                {
                    response.error = "Please sign in!";
                    callback(true);
                    status = 401;
                }
                else
                {
                    callback();
                }
            });
        },
        function(callback)
        {
            Challenge
            .find({ sender : user._id })
            .sort('-timestamp')
            .populate('info', '-challenges')
            .populate('sender', '-friends')
            .populate('receiver', '-friends')
            .exec(function(err, retData)
            {
                challenges = retData;

                callback();
            });
        }
    ], function(invalid)
    {
        if(!invalid)
            response = challenges;

        res.status(status).send(response);
    });

}

/*
 * [POST] LIKE A CHALLENGE
 * (need to be authed) 
 *
 * @param String challengeId
 * @return Mixed(Challenge + ChallengeBase) data
 */
exports.likeChallenge = function(req, res)
{
    var data = req.body;

    var response = {};
    var status = 200;

    var user,
        challenge,
        likeDoubt;

    async.series([

        function(callback)
        {
            auth.isAuthenticated(req, function(retData)
            {
                user = retData;

                if(user == null)
                {
                    response.error = "Please sign in!";
                    status = 401;
                    callback(true);
                }
                else if(data.challengeId === undefined)
                {
                    response.error = "Give me a challengeId!";
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
            Challenge
            .findOne({ _id : data.challengeId })
            .exec(function(err, retData)
            {
                challenge = retData;

                if(challenge == null
                || challenge === undefined)
                {
                    response.error = "Challenge not found!";
                    status = 422;
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
            LikeDoubt
            .findOne({
                userId : user._id,
                challengeId : data.challengeId
            })
            .exec(function(err, retData){

                likeDoubt = retData;

                if(likeDoubt == null
                || likeDoubt === undefined)
                {
                    likeDoubt = new LikeDoubt({
                        userId : user._id,
                        challengeId : data.challengeId,
                        liked : 0,
                        doubted : 0
                    });
                }

                callback();

            });
        },
        function(callback)
        {
            if(challenge.status == 1)
            {
                challenge.likes++;

                likeDoubt.liked++;
            }
            else if(challenge.status <= 0)
            {
                challenge.doubts++;

                likeDoubt.doubted++;
            }

            if(challenge.status == 2)
            {
                response.error = "Challenge is refused!";
                status = 422;
                callback(true);
            }
            else
            {
                challenge.save(function(err, retData)
                {
                    challenge = retData;

                    likeDoubt.save(function(err, retData)
                    {
                        likeDoubt = retData;
                    });

                    callback();
                });
            }
        },
        function(callback)
        {            
            challenge
            .populate('info', '-challenges')
            .populate('sender', '-friends')
            .populate('receiver', '-friends', function(err, retData)
            {
                challenge = retData;

                callback();
            });
        }
    ], function(invalid)
    {
        if(!invalid)
            response = challenge;

        res.status(status).send(response);
    });
}

/*
 * [POST] ACCEPT A CHALLENGE
 * (need to be authed) 
 *
 * @param String url
 * @param String challengeId
 * @return Mixed(Challenge + ChallengeBase) data
 */
exports.acceptChallenge = function(req, res)
{
    var data = req.body;

    var response = {};
    var status = 200;

    var user,
        challenge;

    async.series([

        function(callback)
        {
            auth.isAuthenticated(req, function(retData)
            {
                user = retData;

                if(user == null)
                {
                    response.error = "Please sign in!";
                    status = 401;
                    callback(true);
                }
                else if(data.challengeId === undefined)
                {
                    response.error = "Give me a challengeId!";
                    status = 400;
                    callback(true);
                }
                else if(data.url === undefined)
                {
                    response.error = "Give me an url!";
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
            Challenge
            .findOne({ _id : data.challengeId })
            .exec(function(err, retData)
            {
                challenge = retData;

                if(challenge == null
                || challenge === undefined)
                {
                    response.error = "Challenge not found!";
                    status = 422;
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
            if(challenge.receiver != user._id)
            {
                response.error = "This challenge does not belong to you!";
                status = 422;
                callback(true);
            }
            else if(challenge.status > 0)
            {
                response.error = "This challenge is finalized!";
                status = 422;
                callback(true);
            }
            else
            {
                callback();
            }
        },
        function(callback)
        { 
            challenge.url = data.url;
            challenge.status = 1;
            challenge.timestamp = timestamp;

            challenge.save(function(err, retData)
            {
                challenge = retData;

                callback();
            });
        },
        function(callback)
        {            
            challenge
            .populate('info', '-challenges')
            .populate('sender', '-friends')
            .populate('receiver', '-friends', function(err, retData)
            {
                challenge = retData;

                callback();
            });
        }

    ], function(invalid)
    {
        if(!invalid)
            response = challenge;

        res.status(status).send(response);
    });

}

/*
 * [POST] REFUSE A CHALLENGE
 * (need to be authed) 
 *
 * @param String challengeId
 * @return Mixed(Challenge + ChallengeBase) data
 */
exports.refuseChallenge = function(req, res)
{
    var data = req.body;

    var response = {};
    var status = 200;

    var user,
        challenge;

    async.series([

        function(callback)
        {
            auth.isAuthenticated(req, function(retData)
            {
                user = retData;

                if(user == null)
                {
                    response.error = "Please sign in!";
                    status = 401;
                    callback(true);
                }
                else if(data.challengeId === undefined)
                {
                    response.error = "Give me a challengeId!";
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
            Challenge
            .findOne({ _id : data.challengeId })
            .exec(function(err, retData)
            {
                challenge = retData;

                if(challenge == null
                || challenge === undefined)
                {
                    response.error = "Challenge not found!";
                    status = 422;
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
            if(challenge.receiver != user._id)
            {
                response.error = "This challenge does not belong to you!";
                status = 422;
                callback(true);
            }
            else if(challenge.status > 0)
            {
                response.error = "This challenge is finalized!";
                status = 422;
                callback(true);
            }
            else
            {
                callback();
            }
        },
        function(callback)
        { 
            challenge.status = 2;
            challenge.timestamp = timestamp;

            challenge.save(function(err, retData)
            {
                challenge = retData;

                callback();
            });
        },
        function(callback)
        {
            challenge
            .populate('info', '-challenges')
            .populate('sender', '-friends')
            .populate('receiver', '-friends', function(err, retData)
            {
                challenge = retData;

                callback();
            });
        }

    ], function(invalid)
    {
        if(!invalid)
            response = challenge;

        res.status(status).send(response);
    });
}
