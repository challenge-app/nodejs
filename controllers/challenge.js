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
 * [POST] CREATE A CHALLENGEBASE
 * (need to be authed) 
 *
 * @param String description
 * @param (opt) Boolean def
 * @param (opt) Number difficulty
 * @param (opt) String baseId
 * @return ChallengeBase data
 */
exports.newChallengeBase = function(req, res) {

    var data = req.body;

    var response = {};
    var status = 200; //200

    var user,
        challBase;

    async.series([

        function(callback)
        {
            auth.isAuthenticated(req, function(retData)
            {
                user = retData;

                if(user == null)
                {
                    response.code = 10;
                    status = 401; //401
                    callback(true);
                }
                else if(data.description === undefined)
                {
                    response.code = 5;
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
            var def = false,
                difficulty = 0;

            if(data.def !== undefined)
            {
                def = data.def;
            }

            if(data.difficulty !== undefined)
            {
                difficulty = data.difficulty;
            }

            challBase = new ChallengeBase({
                description : data.description,
                generalLikes : 0,
                generalDoubts : 0,
                def : def,
                difficulty : difficulty,
                timestamp : timestamp
            });

            challBase.save(function(err, retData)
            {
                challBase = retData;

                callback();
            });
        }
    ], function(invalid)
    {
        if(!invalid)
            response = challBase;

        res.status(status).send(response);
    });
}

/*
 * [POST] CREATE A CHALLENGE
 * (need to be authed) 
 *
 * @param String receiverId
 * @param String reward
 * @param String type
 * @param String description
 * @param (opt) Boolean def
 * @param (opt) Number difficulty
 * @param (opt) String baseId
 * @return Mixed(Challenge + ChallengeBase) data
 */
exports.newChallenge = function(req, res) {

    var data = req.body;

    var response = {};
    var status = 200; //200

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
                    response.code = 10;
                    status = 401; //401
                    callback(true);
                }
                else if(data.receiverId === undefined)
                {
                    response.code = 4;
                    status = 400; //400
                    callback(true);
                }
                else if(data.description === undefined
                     && data.baseId === undefined)
                {
                    response.code = 5;
                    status = 400; //400
                    callback(true);
                }
                else if(data.type === undefined)
                {
                    response.code = 6;
                    status = 400; //400
                    callback(true);
                }
                else if(data.type != "video"
                     && data.type != "picture")
                {
                    response.code = 15;
                    status = 422; //422
                    callback(true);
                }
                else if(data.receiverId == user._id)
                {
                    response.code = 22;
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
            User.findOne({_id : data.receiverId}, function(err, retData)
            {
                challenged = retData;

                if(challenged == null)
                {
                    response.code = 11;
                    status = 422; //422
                    callback(true);
                }
                else if(!user.hasFriend(challenged._id))
                {
                    response.code = 23;
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
            if(data.baseId !== undefined)
            {
                ChallengeBase.findOne({ _id : data.baseId }, function(err, retData)
                {
                    challBase = retData;

                    if(challBase == null
                    || challBase === undefined)
                    {
                        response.code = 16;
                        status = 422; //422
                        callback(true);
                    }
                    else
                    {
                        callback();
                    }
                });
            }
            else
            {
                var def = false,
                    difficulty = 0;

                if(data.def !== undefined)
                {
                    def = data.def;
                }

                if(data.difficulty !== undefined)
                {
                    difficulty = data.difficulty;
                }

                challBase = new ChallengeBase({
                    description : data.description,
                    generalLikes : 0,
                    generalDoubts : 0,
                    def : def,
                    difficulty : difficulty,
                    timestamp : timestamp
                });

                challBase.save(function(err, retData)
                {
                    challBase = retData;

                    callback();
                });
            }
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

                var feed = new Feed({
                    users: [],
                    type: 0,
                    challenge: chall._id,
                    notify: true,
                    seen: false,
                    timestamp: timestamp
                });

                feed.users.push(user);
                feed.users.push(challenged);

                feed.save(function(err, retData){});

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
 * [GET] RANDOM CHALLENGES
 * (need to be authed) 
 *
 * @return Mixed(Challenge + ChallengeBase) data
 */
exports.randomChallenges = function(req, res) {

    var response = {};
    var status = 200; //200

    var user;

    auth.isAuthenticated(req, function(retData)
    {
        user = retData;

        if(user == null)
        {
            response.code = 10;
            status = 401; //401
            res.status(status).send(response);
        }
        else
        {
            async.parallel(
            [
                function(callback)
                {
                    ChallengeBase
                    .find({
                        def : true,
                        difficulty : 0
                    }, '-challenges')
                    .exec(function(err, result)
                    {
                        var rand = Math.floor(Math.random() * result.length);

                        callback(null, result[rand]);
                    });
                },
                function(callback)
                {
                    ChallengeBase
                    .find({
                        def : true,
                        difficulty : 1
                    }, '-challenges')
                    .exec(function(err, result)
                    {
                        var rand = Math.floor(Math.random() * result.length);

                        callback(null, result[rand]);
                    });
                },
                function(callback)
                {
                    ChallengeBase
                    .find({
                        def : true,
                        difficulty : 2
                    }, '-challenges')
                    .exec(function(err, result)
                    {
                        var rand = Math.floor(Math.random() * result.length);

                        callback(null, result[rand]);
                    });
                }
            ],
            function(err, results)
            {
                res.status(status).send(results);
            });
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
    var status = 200; //200

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
                    response.code = 10;
                    callback(true);
                    status = 401; //401
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
            .lean()
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
    var status = 200; //200

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
                    response.code = 10;
                    callback(true);
                    status = 401; //401
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
            .lean()
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
    var error = false;
    var response = {};
    var status = 200; //200

    var user,
        challenge,
        likeDoubt,
        feed;

    async.series([

        function(callback)
        {
            auth.isAuthenticated(req, function(retData)
            {
                user = retData;

                if(user == null)
                {
                    response.code = 10;
                    status = 401; //401
                    callback(true);
                }
                else if(data.challengeId === undefined)
                {
                    response.code = 7;
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
            Challenge
            .findOne({ _id : data.challengeId })
            .exec(function(err, retData)
            {
                challenge = retData;

                if(challenge == null
                || challenge === undefined)
                {
                    response.code = 16;
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
                        liked : false,
                        doubted : false,
                        timestamp : timestamp
                    });
                }

                callback();

            });
        },
        function(callback)
        {
            var error = false;

            Feed
            .findOne({
                challenge : challenge._id,
                type : 4
            })
            .exec(function(err, retData)
            {
                feed = retData;

                var type;

                if(challenge.status == 1)
                    type = 4;
                else if(challenge.status <= 0)
                    type = 3;
                
                if(challenge.status > 1)
                {
                    response.code = 17;
                    status = 422; //422
                    callback(true);
                }
                else
                {
                    if(feed == null
                    || feed === undefined)
                    {
                        feed = new Feed({
                            users: [],
                            challenge: challenge._id,
                            type: type,
                            culprit: user._id,
                            notify: true,
                            seen: false,
                            timestamp: timestamp
                        });
                    }
                    else
                    {
                        feed.culprit = user._id;
                        feed.timestamp = timestamp;
                    }

                    feed.users.push(challenge.sender);
                    feed.users.push(challenge.receiver);

                    callback();
                }
            });
        },
        function(callback)
        {
            if(challenge.status == 1)
            {
                if(likeDoubt.liked)
                {
                    response.code = 18;
                    status = 422; //422
                    error = true;
                }
                else
                {
                    challenge.likes++;

                    likeDoubt.liked = true;
                }
            }
            else if(challenge.status <= 0)
            {
                if(likeDoubt.doubted)
                {
                    response.code = 19;
                    status = 422; //422
                    error = true;
                }
                else
                {
                    challenge.doubts++;

                    likeDoubt.doubted = true;
                }
            }
            
            if(challenge.status == 2)
            {
                response.code = 17;
                status = 422; //422
                callback(true);
            }
            else if(!error)
            {
                challenge.save(function(err, retData)
                {
                    challenge = retData;

                    likeDoubt.timestamp = timestamp;

                    likeDoubt.save(function(err, retData) {});

                    feed.save(function(err, retData) {});

                    callback();
                });
            }
            else
            {
                callback(true);
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
    var status = 200; //200

    var user,
        challenge,
        feed;

    async.series([

        function(callback)
        {
            auth.isAuthenticated(req, function(retData)
            {
                user = retData;

                if(user == null)
                {
                    response.code = 10;
                    status = 401; //401
                    callback(true);
                }
                else if(data.challengeId === undefined)
                {
                    response.code = 7;
                    status = 400; //400
                    callback(true);
                }
                else if(data.url === undefined)
                {
                    response.code = 8;
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
            Challenge
            .findOne({ _id : data.challengeId })
            .exec(function(err, retData)
            {
                challenge = retData;

                if(challenge == null
                || challenge === undefined)
                {
                    response.code = 16;
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
            if(challenge.receiver != user._id)
            {
                response.code = 20;
                status = 422; //422
                callback(true);
            }
            else if(challenge.status > 0)
            {
                response.code = 21;
                status = 422; //422
                callback(true);
            }
            else
            {
                callback();
            }
        },
        function(callback)
        {
            feed = new Feed({
                users: [],
                challenge: challenge._id,
                type: 1,
                notify: true,
                seen: false,
                timestamp: timestamp
            });

            feed.users.push(challenge.sender);
            feed.users.push(challenge.receiver);

            callback();
        },
        function(callback)
        { 
            challenge.url = data.url;
            challenge.status = 1; //1
            challenge.timestamp = timestamp;

            challenge.save(function(err, retData)
            {
                challenge = retData;

                callback();
            });
        },
        function(callback)
        {
            feed.save(function(err, retData) {});

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
    var status = 200; //200

    var user,
        challenge,
        feed;

    async.series([

        function(callback)
        {
            auth.isAuthenticated(req, function(retData)
            {
                user = retData;

                if(user == null)
                {
                    response.code = 10;
                    status = 401; //401
                    callback(true);
                }
                else if(data.challengeId === undefined)
                {
                    response.code = 7;
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
            Challenge
            .findOne({ _id : data.challengeId })
            .exec(function(err, retData)
            {
                challenge = retData;

                if(challenge == null
                || challenge === undefined)
                {
                    response.code = 16;
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
            if(challenge.receiver != user._id)
            {
                response.code = 20;
                status = 422; //422
                callback(true);
            }
            else if(challenge.status > 0)
            {
                response.code = 21;
                status = 422; //422
                callback(true);
            }
            else
            {
                callback();
            }
        },
        function(callback)
        { 
            challenge.status = 2; //2
            challenge.timestamp = timestamp;

            challenge.save(function(err, retData)
            {
                challenge = retData;

                callback();
            });
        },
        function(callback)
        {
            feed = new Feed({
                users: [],
                challenge: challenge._id,
                type: 2,
                notify: true,
                seen: false,
                timestamp: timestamp
            });

            feed.users.push(challenge.sender);
            feed.users.push(challenge.receiver);

            callback();
        },
        function(callback)
        {
            feed.save(function(err, retData) {});

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
