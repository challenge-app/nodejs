var models = [],
		controllers = [];

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
		["generalVotes", "Number", "All thumbs up."],
		["challenges", "Challenge", "Array of challenges."],
		["timestamp", "String", "Last edit timestamp."]
	],
	example: [
		{
			"description": "I dare you to walk with a horse mask!",
			"generalVotes": 0,
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
					"votes": 0,
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
		["votes", "Number", "Thumbs up."],
		["timestamp", "String",  "Last edit timestamp."]
	],
	example: [
		{
			"info": {
				"description": "I dare you to walk with a horse mask!",
				"generalVotes": 0,
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
			"votes": 0,
			"timestamp": "1390980083413",
			"_id": "52e8abf53d7dd12f76eeb1a8"
		}
	]
});

controllers.push({
	name: "user",
	show: "User",
	routes: [
		{
			routeName: "/",
			method: "POST",
			params: [
				[],
				["email"],
				["email","password"],
				["email","password"],
			],
			headers: [
				[],
				[],
				[],
				[],
			],
			returns: [
				[400, "error", "{ error : \"I need an email!\" }"],
				[400, "error", "{ error : \"I need a password!\" }"],
				[422, "error", "{ error : \"User already exists!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to create a new <a href=\"#\" data-trigger=\"user-model\">User</a>.</p>",
			example: [
				'[POST] URL /user',
				'PARAMETERS { email : "abc@test.com", password : "123456" }',
				'HEADERS',
				'STATUS 200 OK',
				{
					"_id": "52e863d7fc1c741857d152f6",
					"email": "abc@teste.com",
					"authenticationToken": "$2a$12$yvxdiZlYhdy7KF.wwH.J9eaeJ/UytKfsqfZ4FPt4ryoFbQdA24kDe",
				}
			]
		},
		{
			routeName: "/",
			method: "GET",
			params: [
				[],
				[],
			],
			headers: [
				[],
				["X-AUTH-TOKEN"],
			],
			returns: [
				[401, "error", "{ error : \"Please sign-in!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to recover current <a href=\"#\" data-trigger=\"user-model\">User</a> in session.</p>",
			example: [
				'[GET] URL /user',
				'PARAMETERS',
				'HEADERS X-AUTH-TOKEN=$2a$12$yvxdiZlYhdy7KF.wwH.J9eaeJ/UytKfsqfZ4FPt4ryoFbQdA24kDe',
				'STATUS 200 OK',
				{
					"_id": "52e863d7fc1c741857d152f6",
					"email": "abc@teste.com"
				}
			]
		},
		{
			routeName: "/$_id",
			method: "GET",
			params: [
				[],
				[],
			],
			headers: [
				[],
				[],
			],
			returns: [
				[422, "error", "{ error : \"User not found!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to recover a <a href=\"#\" data-trigger=\"user-model\">User</a> by his $_id.</p>",
			example: [
				'[GET] URL /user/52e863d7fc1c741857d152f6',
				'PARAMETERS',
				'HEADERS',
				'STATUS 200 OK',
				{
					"_id": "52e863d7fc1c741857d152f6",
					"email": "abc@teste.com"
				}
			]
		},
		{
			routeName: "/find",
			method: "POST",
			params: [
				[],
				["email"],
				["email"],
			],
			headers: [
				[],
				[],
				[],
			],
			returns: [
				[400, "error", "{ error : \"I need an email!\" }"],
				[422, "error", "{ error : \"User not found!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to recover a <a href=\"#\" data-trigger=\"user-model\">User</a> by his $email.</p>",
			example: [
				'[POST] URL /user/find',
				'PARAMETERS { email : "abc@teste.com" }',
				'HEADERS',
				'STATUS 200 OK',
				{
					"_id": "52e863d7fc1c741857d152f6",
					"email": "abc@teste.com"
				}
			]
		},
		{
			routeName: "/auth",
			method: "POST",
			params: [
				[],
				["email"],
				["email"],
				["email", "password"],
				["email", "password"],
			],
			headers: [
				[],
				[],
				[],
				[],
				[],
			],
			returns: [
				[400, "error", "{ error : \"I need an email!\" }"],
				[422, "error", "{ error : \"User not found!\" }"],
				[400, "error", "{ error : \"I need a password!\" }"],
				[400, "error", "{ error : \"Password incorrect!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to auth a <a href=\"#\" data-trigger=\"user-model\">User</a>.</p>",
			example: [
				'[POST] URL /user/auth',
				'PARAMETERS { email : "abc@teste.com", password : "123456" }',
				'HEADERS',
				'STATUS 200 OK',
				{
					"_id": "52e863d7fc1c741857d152f6",
					"email": "abc@teste.com",
					"authenticationToken": "$2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O"
				}
			]
		},
		{
			routeName: "/logout",
			method: "GET",
			params: [
				[],
				[],
			],
			headers: [
				[],
				["X-AUTH-TOKEN"],
			],
			returns: [
				[401, "error", "{ error : \"Unauthorized!\" }"],
				[200, "success", "{ message : \"You are out!\" }"]
			],
			description: "Will try to unauth a <a href=\"#\" data-trigger=\"user-model\">User</a>.</p>",
			example: [
				'[POST] URL /user/logout',
				'PARAMETERS',
				'HEADERS X-AUTH-TOKEN=$2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				{
					"message": "You are out!"
				}
			]
		},
		{
			routeName: "/friends",
			method: "GET",
			params: [
				[],
				[],
			],
			headers: [
				[],
				["X-AUTH-TOKEN"],
			],
			returns: [
				[401, "error", "{ error : \"Unauthorized!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to recover a <a href=\"#\" data-trigger=\"user-model\">User</a> collection (his friends).</p>",
			example: [
				'[GET] URL /user/friends',
				'PARAMETERS',
				'HEADERS X-AUTH-TOKEN=$2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				{
					"_id": "52e863d7fc1c741857d152f6",
					"email": "abc@teste.com",
					"friends": {
						"_id": "42e863d7fc1c121857d152f6",
						"email": "friend@teste.com"
					}
				}
			]
		},
		{
			routeName: "/friend",
			method: "POST",
			params: [
				[],
				[],
				["_id"],
				["_id"],
				["_id"],
			],
			headers: [
				[],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
			],
			returns: [
				[401, "error", "{ error : \"Please sign-in!\" }"],
				[400, "error", "{ error : \"Give me an _id!\" }"],
				[422, "error", "{ error : \"User not found!\" }"],
				[422, "error", "{ error : \"He is already your friend!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to add a new friend of <a href=\"#\" data-trigger=\"user-model\">User</a>.</p>",
			example: [
				'[POST] URL /user/friend',
				'PARAMETERS { _id : "42e863d7fc1c121857d152f6" }',
				'HEADERS X-AUTH-TOKEN=$2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				{
					"_id": "52e863d7fc1c741857d152f6",
					"email": "abc@teste.com",
					"friends": {
						"_id": "42e863d7fc1c121857d152f6",
						"email": "friend@teste.com"
					}
				}
			]
		},
	]
});

controllers.push({
	name: "challenge",
	show: "Challenge",
	routes: [
		{
			routeName: "/",
			method: "POST",
			params: [
				[],
				[],
				["receiverId"],
				["receiverId", "description"],
				["receiverId", "description", "type"],
				["receiverId", "description", "type", "reward *"],
				["receiverId", "description", "type", "reward *"],
			],
			headers: [
				[],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
			],
			returns: [
				[401, "error", "{ error : \"Please sign-in!\" }"],
				[400, "error", "{ error : \"Give me an receiverId!\" }"],
				[400, "error", "{ error : \"Give me a description!\" }"],
				[400, "error", "{ error : \"Give me a type!\" }"],
				[422, "error", "{ error : \"User not found!\" }"],
				[422, "error", "{ error : \"Type must be 'video' or 'picture'!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"challenge-model\">Challenge</a>"]
			],
			description: "Will try to create a new <a href=\"#\" data-trigger=\"challenge-model\">Challenge</a>.</p>",
			example: [
				'[POST] URL /challenge',
				'PARAMETERS { receiverId : "52cc9cd3515sab4d1554de49", description : "I dare you to drink water upside down!", reward : 50 }',
				'HEADERS X-AUTH-TOKEN = $2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				{
					"info": {
						"description": "I dare you to walk with a horse mask!",
						"generalVotes": 0,
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
					"url": "http://youtube.com/ASfnNk=",
					"type": "video",
					"reward": 10,
					"votes": 0,
					"timestamp": "1390980083413",
					"_id": "52e8abf53d7dd12f76eeb1a8"
				}
			]
		},
		{
			routeName: "/received",
			method: "GET",
			params: [
				[],
				[],
			],
			headers: [
				[],
				["X-AUTH-TOKEN"],
			],
			returns: [
				[401, "error", "{ error : \"Please sign-in!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"challenge-model\">Challenge []</a>"]
			],
			description: "Will try to get all received <a href=\"#\" data-trigger=\"challenge-model\">Challenges</a>.</p>",
			example: [
				'[GET] URL /challenge/received',
				'PARAMETERS ',
				'HEADERS X-AUTH-TOKEN = $2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				[
					{
						"info": {
							"description": "I dare you to walk with a horse mask!",
							"generalVotes": 0,
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
						"url": "http://youtube.com/ASfq@31=",
						"type": "video",
						"reward": 10,
						"votes": 0,
						"timestamp": "1390980083413",
						"_id": "52e8abf53d7dd12f76eeb1a8"
					}
				]
			]
		},
		{
			routeName: "/sent",
			method: "GET",
			params: [
				[],
				[],
			],
			headers: [
				[],
				["X-AUTH-TOKEN"],
			],
			returns: [
				[401, "error", "{ error : \"Please sign-in!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"challenge-model\">Challenge []</a>"]
			],
			description: "Will try to get all sent <a href=\"#\" data-trigger=\"challenge-model\">Challenges</a>.</p>",
			example: [
				'[GET] URL /challenge/sent',
				'PARAMETERS ',
				'HEADERS X-AUTH-TOKEN = $2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				[
					{
						"info": {
							"description": "I dare you to walk with a horse mask!",
							"generalVotes": 0,
							"timestamp": "1390980083413",
							"_id": "52e8abf53d7dd12f76eeb1a7"
						},
						"sender": {
							"_id": "52e863ecfc1c741857d152f7",
							"email": "b"
						},
						"receiver": {
							"_id": "52e863d7fc1c741857d152f6",
							"email": "a"
						},
						"status": -1,
						"url": "http://youtube.com/ASfq@31=",
						"type": "video",
						"reward": 10,
						"votes": 0,
						"timestamp": "1390980083413",
						"_id": "52e8abf53d7dd12f76eeb1a8"
					}
				]
			]
		},
		{
			routeName: "/accept",
			method: "POST",
			params: [
				[],
				["challengeId"],
				["challengeId", "url"],
				["challengeId", "url"],
				["challengeId", "url"],
				["challengeId", "url"],
				["challengeId", "url"],
			],
			headers: [
				[],
				[],
				[],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
			],
			returns: [
				[400, "error", "{ error : \"Give me a challengeId!\" }"],
				[400, "error", "{ error : \"Give me an url!\" }"],
				[401, "error", "{ error : \"Please sign in!\" }"],
				[422, "error", "{ error : \"Challenge not found!\" }"],
				[422, "error", "{ error : \"This challenge does not belong to you!\" }"],
				[422, "error", "{ error : \"This challenge is finalized!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"challenge-model\">Challenge</a>"]
			],
			description: "Will try to accept a <a href=\"#\" data-trigger=\"challenge-model\">Challenge</a>.</p>",
			example: [
				'[POST] URL /challenge/accept',
				'PARAMETERS { challengeId : "52cc9cd3515sab4d1554de49", url : "http://static.amazon.com/asfasf" }',
				'HEADERS X-AUTH-TOKEN = $2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				{
					"info": {
						"description": "DUvido",
						"generalVotes": 0,
						"timestamp": "1391001669782",
						"_id": "52e9009e0d8fe3510199b118"
					},
					"sender": {
						"_id": "52e863ecfc1c741857d152f7",
						"email": "b"
					},
					"receiver": {
						"_id": "52e863d7fc1c741857d152f6",
						"email": "a"
					},
					"status": 1,
					"url": "http://youtube.com/ASfq@31=",
					"type": "picture",
					"reward": 10,
					"votes": 0,
					"timestamp": "1391001669782",
					"_id": "52e9009e0d8fe3510199b119"
				}
			]
		},
		{
			routeName: "/refuse",
			method: "POST",
			params: [
				[],
				["challengeId"],
				["challengeId"],
				["challengeId"],
				["challengeId"],
				["challengeId"],
			],
			headers: [
				[],
				[],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
			],
			returns: [
				[400, "error", "{ error : \"Give me a challengeId!\" }"],
				[401, "error", "{ error : \"Please sign in!\" }"],
				[422, "error", "{ error : \"Challenge not found!\" }"],
				[422, "error", "{ error : \"This challenge does not belong to you!\" }"],
				[422, "error", "{ error : \"This challenge is finalized!\" }"],
				[200, "success", "<a href=\"#\" data-trigger=\"challenge-model\">Challenge</a>"]
			],
			description: "Will try to refuse a <a href=\"#\" data-trigger=\"challenge-model\">Challenge</a>.</p>",
			example: [
				'[POST] URL /challenge/refuse',
				'PARAMETERS { challengeId : "52cc9cd3515sab4d1554de49" }',
				'HEADERS X-AUTH-TOKEN = $2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				{
					"info": {
						"description": "DUvido",
						"generalVotes": 0,
						"timestamp": "1391001669782",
						"_id": "52e9009e0d8fe3510199b118"
					},
					"sender": {
						"_id": "52e863ecfc1c741857d152f7",
						"email": "b"
					},
					"receiver": {
						"_id": "52e863d7fc1c741857d152f6",
						"email": "a"
					},
					"status": 2,
					"url": "http://youtube.com/ASfq@31=",
					"type": "picture",
					"reward": 10,
					"votes": 0,
					"timestamp": "1391001669782",
					"_id": "52e9009e0d8fe3510199b119"
				}
			]
		}
	]
});

exports.getModels = function()
{
	return models;
}

exports.getControllers = function()
{
	return controllers;
}