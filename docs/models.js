var models = [];

models.push({
	name: "user",
	show: "User",
	content: [
		["_id", "String", "ID"],
		["email", "String", "User email."],
		["password", "String", "User password."],
		["authenticationToken", "String", "X-AUTH-TOKEN"],
		["firstName", "String", "His first name."],
		["lastName", "String", "His last name."],
		["username", "String", "His nickname."],
		["phone", "String", "His phone number."]
	],
	example: [
		{
			"_id": "52fc555ffc8d61b906fff96a",
			"email": "mcgiordalp@gmail.com",
			"firstName": "Mauricio",
			"lastName": "Giordano",
			"phone": "19991425302",
			"username": "mgiordano"
		}
	]
});

models.push({
	name: "challengebase",
	show: "ChallengeBase",
	content: [
		["_id", "String", "ID"],
		["description", "String", "Description of the challenge."],
		["generalLikes", "Number", "All thumbs up."],
		["challenges", "Challenge", "Array of challenges."],
		["generalDoubts", "Number", "All doubts."],
		["* def", "Boolean", "If is created by us (founders)."],
		["* difficulty", "Number", "(only if def is true) 0: easy, 1: medium, 2: hard."],
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
			],
			"generalDoubts" : 1,
			"def" : false,
			"difficulty" : 0
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

models.push({
	name: "feed",
	show: "Feed",
	content: [
		["_id", "String", "ID"],
		["challenge", "Challenge", "The challenge of the current feed."],
		["type", "Number", "0: Has been challenged; 1: Accepted a challenge; 2: Refused a challenge; 3: Someone doubted; 4: Someone liked"],
		["culprit", "User", "If type equals 3 or 4, here will be the last user that doubted/liked"],
		["whoElse", "User", "Array of users for type 3 or 4"],
		["timestamp", "String", "Last edit"]
	],
	example: [
		[
		    {
		        "challenge": {
		            "info": {
		                "description": "Duvido tu pula u muro",
		                "generalLikes": 0,
		                "generalDoubts": 0,
		                "timestamp": "1392348878027",
		                "_id": "52fd8f54723fe9e50daceb59"
		            },
		            "sender": {
		                "_id": "52fc5833ebed4ae706451c1b",
		                "email": "mauricio.c.giordano@gmail.com"
		            },
		            "receiver": {
		                "_id": "52fc555ffc8d61b906fff96a",
		                "email": "mcgiordalp@gmail.com",
		                "firstName": "Mauricio",
		                "timestamp": "1392353969608",
		                "username": "mgiordano"
		            },
		            "status": -1,
		            "url": "",
		            "type": "video",
		            "reward": "0",
		            "likes": 0,
		            "doubts": 1,
		            "timestamp": "1392348878027",
		            "_id": "52fd8f54723fe9e50daceb5a"
		        },
		        "type": 3,
		        "culprit": {
		            "_id": "52fc555ffc8d61b906fff96a",
		            "email": "mcgiordalp@gmail.com",
		            "firstName": "Mauricio",
		            "username": "mgiordano"
		        },
		        "timestamp": "1392349152118",
		        "_id": "52fd8fe3d25602f20de32407",
		        "__v": 0,
		        "whoElse": []
		    },
		    {
		        "challenge": {
		            "_id": "52fd8b8649c5b52c0df81de2",
		            "info": {
		                "description": "Te desafio a kk",
		                "generalLikes": 0,
		                "generalDoubts": 0,
		                "timestamp": "1392347912249",
		                "_id": "52fd8b8649c5b52c0df81de1"
		            },
		            "sender": {
		                "_id": "52fc555ffc8d61b906fff96a",
		                "email": "mcgiordalp@gmail.com",
		                "firstName": "Mauricio",
		                "timestamp": "1392353969608",
		                "username": "mgiordano"
		            },
		            "receiver": {
		                "_id": "52fc5833ebed4ae706451c1b",
		                "email": "mauricio.c.giordano@gmail.com"
		            },
		            "status": 2,
		            "url": "",
		            "type": "video",
		            "reward": "0",
		            "likes": 0,
		            "doubts": 0,
		            "timestamp": "1392348878027"
		        },
		        "type": 2,
		        "timestamp": "1392348878027",
		        "_id": "52fd8ed4723fe9e50daceb57",
		        "__v": 0,
		        "culprit": null,
		        "whoElse": []
		    },
		    {
		        "type": 0,
		        "challenge": {
		            "info": {
		                "description": "Duvido tu pula u muro",
		                "generalLikes": 0,
		                "generalDoubts": 0,
		                "timestamp": "1392348878027",
		                "_id": "52fd8f54723fe9e50daceb59"
		            },
		            "sender": {
		                "_id": "52fc5833ebed4ae706451c1b",
		                "email": "mauricio.c.giordano@gmail.com"
		            },
		            "receiver": {
		                "_id": "52fc555ffc8d61b906fff96a",
		                "email": "mcgiordalp@gmail.com",
		                "firstName": "Mauricio",
		                "timestamp": "1392353969608",
		                "username": "mgiordano"
		            },
		            "status": -1,
		            "url": "",
		            "type": "video",
		            "reward": "0",
		            "likes": 0,
		            "doubts": 1,
		            "timestamp": "1392348878027",
		            "_id": "52fd8f54723fe9e50daceb5a"
		        },
		        "timestamp": "1392348878027",
		        "_id": "52fd8f54723fe9e50daceb5b",
		        "__v": 0,
		        "culprit": null,
		        "whoElse": []
		    },
		    {
		        "type": 0,
		        "challenge": {
		            "_id": "52fd8b8649c5b52c0df81de2",
		            "info": {
		                "description": "Te desafio a kk",
		                "generalLikes": 0,
		                "generalDoubts": 0,
		                "timestamp": "1392347912249",
		                "_id": "52fd8b8649c5b52c0df81de1"
		            },
		            "sender": {
		                "_id": "52fc555ffc8d61b906fff96a",
		                "email": "mcgiordalp@gmail.com",
		                "firstName": "Mauricio",
		                "timestamp": "1392353969608",
		                "username": "mgiordano"
		            },
		            "receiver": {
		                "_id": "52fc5833ebed4ae706451c1b",
		                "email": "mauricio.c.giordano@gmail.com"
		            },
		            "status": 2,
		            "url": "",
		            "type": "video",
		            "reward": "0",
		            "likes": 0,
		            "doubts": 0,
		            "timestamp": "1392348878027"
		        },
		        "timestamp": "1392347912249",
		        "_id": "52fd8b8749c5b52c0df81de3",
		        "__v": 0,
		        "culprit": null,
		        "whoElse": []
		    }
		]
	]
});

exports.getModels = function()
{
	return models;
}
