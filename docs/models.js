var models = [];

models.push({
	name: "user",
	show: "User",
	content: [
		["_id", "String", "ID"],
		["email", "String", "User email."],
		["password", "String", "User password."],
		["authenticationToken", "String", "X-AUTH-TOKEN"],
		["friends", "User", "Array of users."]
	],
	example: [
		{
			"_id": "52e863d7fc1c741857d152f6",
			"email": "a",
			"authenticationToken": "$2a$12$yvxdiZlYhdy7KF.wwH.J9eaeJ/UytKfsqfZ4FPt4ryoFbQdA24kDe",
			"friends": [
				{
					"_id": "52e863ecfc1c741857d152f7",
					"email": "b"
				}
			]
		}
	]
})

models.push({
	name: "challengebase",
	show: "ChallengeBase",
	content: [
		["_id", "String", "ID"],
		["description", "String", "Description of the challenge."],
		["generalLikes", "Number", "All thumbs up."],
		["challenges", "Challenge", "Array of challenges."],
		["timestamp", "String", "Last edit timestamp."]
	],
	example: [
		{
			"description": "I dare you to walk with a horse mask!",
			"generalLikes": 0,
			"timestamp": "1390980083413",
			"_id": "52e8abf53d7dd12f76eeb1a7",
			"challenges" : [
				{
					"sender": {
						"_id": "52e863d7fc1c741857d152f6",
						"email": "a"
					},
					"receiver": {
						"_id": "52e863ecfc1c741857d152f7",
						"email": "b"
					},
					"status": -1,
					"url": "http://youtube.com/SAfakKq=",
					"type": "video",
					"reward": 10,
					"likes": 0,
					"doubts": 1,
					"timestamp": "1390980083413",
					"_id": "52e8abf53d7dd12f76eeb1a8"
				}
			]
		}
	]
});

models.push({
	name: "challenge",
	show: "Challenge",
	content: [
		["_id", "String", "ID"],
		["info", "ChallengeBase", "Challenge info."],
		["sender", "User", "The challenger."],
		["receiver", "User", "Who has been challenged."],
		["status", "Number", "-1: not seen; 0: seen; 1: done; 2: refused"],
		["url", "String", "Video URL of the challenge."],
		["type", "String", "Determines if it's 'video' or a 'picture'."],
		["reward", "Number", "Reputation as reward."],
		["likes", "Number", "Thumbs up."],
		["doubts", "Number", "Doubts up."],
		["timestamp", "String",  "Last edit timestamp."]
	],
	example: [
		{
			"info": {
				"description": "I dare you to walk with a horse mask!",
				"generalLikes": 0,
				"timestamp": "1390980083413",
				"_id": "52e8abf53d7dd12f76eeb1a7"
			},
			"sender": {
				"_id": "52e863d7fc1c741857d152f6",
				"email": "a"
			},
			"receiver": {
				"_id": "52e863ecfc1c741857d152f7",
				"email": "b"
			},
			"status": -1,
			"url": "http://youtube.com/SAfakKq=",
			"type": "video",
			"reward": 10,
			"likes": 0,
			"doubts": 2,
			"timestamp": "1390980083413",
			"_id": "52e8abf53d7dd12f76eeb1a8"
		}
	]
});

models.push({
	name: "likedoubt",
	show: "LikeDoubt",
	content: [
		["_id", "String", "ID"],
		["userId", "String", "User ID."],
		["challengeId", "String", "Challenge ID."],
		["liked", "Boolean", "If the user liked."],
		["doubted", "Boolean", "If the user doubted."]
	],
	example: [
		{
			"doubted": true,
			"liked": false,
			"challengeId": "22e8abf53d7dd12f76eeb109",
			"userId": "82e8abf53d7dd12f76eeb1a1",
			"_id": "52e8abf53d7dd12f76eeb1a8"
		}
	]
});

exports.getModels = function()
{
	return models;
}
