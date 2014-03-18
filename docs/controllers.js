var controllers = [];

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
				[400, "error", "{ code : 1 }"],
				[400, "error", "{ code : 2 }"],
				[422, "error", "{ code : 9 }"],
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
					"following":
					[
						{
							"_id": "5301336a7b1560e9012181d4",
							"email": "mauricio.c.giordano@gmail.com",
							"firstName": "Mauricio",
							"timestamp": "1395148847692"
						}
					],
					"followers": []
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
				[401, "error", "{ code : 10 }"],
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
					"email": "abc@teste.com",
					"firstName": "ABC",
					"count":
					{
						"following": 10,
						"followers": 1
					}
				}
			]
		},
		{
			routeName: "/edit",
			method: "POST",
			params: [
				[],
				[],
				["firstName"],
				["firstName", "lastName", "..."],
			],
			headers: [
				[],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
			],
			returns: [
				[401, "error", "{ code : 10 }"],
				[400, "error", "{ code : 28 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"],
			],
			description: "Will try to edit fields from <a href=\"#\" data-trigger=\"user-model\">User</a> in session.</p>",
			example: [
				'[POST] URL /user/edit',
				'PARAMETERS { firstName: "Bruno", lastName: "Lemos" }',
				'HEADERS X-AUTH-TOKEN=$2a$12$yvxdiZlYhdy7KF.wwH.J9eaeJ/UytKfsqfZ4FPt4ryoFbQdA24kDe',
				'STATUS 200 OK',
				{
					"_id": "52e863d7fc1c741857d152f6",
					"email": "abc@teste.com",
					"firstName": "Bruno",
					"lastName": "Lemos",
					"count":
					{
						"following": 10,
						"followers": 1
					}
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
				[422, "error", "{ code : 11 }"],
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
					"email": "abc@teste.com",
					"count":
					{
						"following": 10,
						"followers": 1
					}
				}
			]
		},
		{
			routeName: "/$_id/following",
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
				[422, "error", "{ code : 11 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to recover <a href=\"#\" data-trigger=\"user-model\">Users</a> by the follower $_id.</p>",
			example: [
				'[GET] URL /user/5301335d7b1560e9012181d3/following',
				'PARAMETERS',
				'HEADERS',
				'STATUS 200 OK',
				[
					{
						"_id": "52e863d7fc1c741857d152f6",
						"email": "mcgiordalp@gmail.com",
						"firstName": "Mauricio",
						"lastName": "Giordano",
						"timestamp": "1395149424797",
						"count": {
							"following": 1,
							"followers": 1
						}
					}
				]
			]
		},
		{
			routeName: "/$_id/followers",
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
				[422, "error", "{ code : 11 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to recover <a href=\"#\" data-trigger=\"user-model\">Users</a> by the following $_id.</p>",
			example: [
				'[GET] URL /user/52e863d7fc1c741857d152f6/followers',
				'PARAMETERS',
				'HEADERS',
				'STATUS 200 OK',
				[
					{
						"_id": "5301335d7b1560e9012181d3",
						"email": "brunolemos@gmail.com",
						"firstName": "Bruno",
						"lastName": "Lemos",
						"timestamp": "1395149424797",
						"count": {
							"following": 1,
							"followers": 1
						}
					}
				]
			]
		},
		{
			routeName: "/find",
			method: "POST",
			params: [
				[],
				["query"],
			],
			headers: [
				[],
				[],
			],
			returns: [
				[400, "error", "{ code : 24 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">Users</a>"]
			],
			description: "Will try find <a href=\"#\" data-trigger=\"user-model\">Users</a> that matches the $query.</p>",
			example: [
				'[POST] URL /user/find',
				'PARAMETERS { query : "gmail" }',
				'HEADERS',
				'STATUS 200 OK',
				[
					{
						"_id": "52e863d7fc1c741857d152f6",
						"email": "mauricio@gmail.com",
						"firstName": "Mauricio",
						"lastName": "Giordano",
						"username": "mgiordano",
						"phone": "199999999",
						"count":
						{
							"following": 10,
							"followers": 1
						}
					},
					{
						"_id": "52e863d7fc1c741857d15212",
						"email": "roberto@yahoo.com",
						"firstName": "Roberto",
						"lastName": "Aguiar",
						"username": "ragmail",
						"phone": "199999999",
						"count":
						{
							"following": 10,
							"followers": 1
						}
					}
				]
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
				[400, "error", "{ code : 1 }"],
				[422, "error", "{ code : 11 }"],
				[400, "error", "{ code : 2 }"],
				[400, "error", "{ code : 12 }"],
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
					"authenticationToken": "$2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O",
					"followers": [],
					"following": [
						{
							"_id": "5301336a7b1560e9012181d4",
							"email": "mauricio.c.giordano@gmail.com",
							"timestamp": "1395148847692"
						}
					]
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
				[401, "error", "{ code : 10 }"],
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
			routeName: "/following",
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
				[401, "error", "{ code : 10 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to recover a <a href=\"#\" data-trigger=\"user-model\">User</a> collection that you are following.</p>",
			example: [
				'[GET] URL /user/following',
				'PARAMETERS',
				'HEADERS X-AUTH-TOKEN=$2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				[
					{
						"_id": "42e863d7fc1c121857d152f6",
						"email": "friend@teste.com",
						"firstName": "Mauricio"
					}
				]
			]
		},
		{
			routeName: "/followers",
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
				[401, "error", "{ code : 10 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to recover a <a href=\"#\" data-trigger=\"user-model\">User</a> collection that you are followers.</p>",
			example: [
				'[GET] URL /user/followers',
				'PARAMETERS',
				'HEADERS X-AUTH-TOKEN=$2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				[
					{
						"_id": "42e863d7fc1c121857d152f6",
						"email": "abc@teste.com",
						"firstName": "Roberto"
					}
				]
			]
		},
		{
			routeName: "/follow",
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
				[401, "error", "{ code : 10 }"],
				[400, "error", "{ code : 3 }"],
				[422, "error", "{ code : 11 }"],
				[422, "error", "{ code : 14 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to follow a <a href=\"#\" data-trigger=\"user-model\">User</a>.</p>",
			example: [
				'[POST] URL /user/follow',
				'PARAMETERS { _id : "42e863d7fc1c121857d152f6" }',
				'HEADERS X-AUTH-TOKEN=$2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK', 
				[
					{
						"_id": "42e863d7fc1c121857d152f6",
						"email": "friend@teste.com",
						"firstName": "Mauricio"
					},
					{
						"_id": "42e863d7fc1c121857d152f6",
						"email": "friend2@teste.com",
						"firstName": "Gabriel"
					}
				]
			]
		},
		{
			routeName: "/unfollow",
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
				[401, "error", "{ code : 10 }"],
				[400, "error", "{ code : 3 }"],
				[422, "error", "{ code : 11 }"],
				[422, "error", "{ code : 27 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"user-model\">User</a>"]
			],
			description: "Will try to unfollow a <a href=\"#\" data-trigger=\"user-model\">User</a>.</p>",
			example: [
				'[POST] URL /user/unfollow',
				'PARAMETERS { _id : "42e863d7fc1c121857d152f6" }',
				'HEADERS X-AUTH-TOKEN=$2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK', 
				[
					{
						"_id": "42e863d7fc1c121857d152f6",
						"email": "friend@teste.com",
						"firstName": "Mauricio"
					},
				]
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
				["receiverId", "description", "type", "reward *", "baseId *"],
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
				[401, "error", "{ code : 10 }"],
				[400, "error", "{ code : 4 }"],
				[400, "error", "{ code : 5 }"],
				[400, "error", "{ code : 6 }"],
				[422, "error", "{ code : 11 }"],
				[422, "error", "{ code : 15 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"challenge-model\">Challenge</a>"]
			],
			description: "Will try to create a new <a href=\"#\" data-trigger=\"challenge-model\">Challenge</a>. <br/><em><strong>OBS: If you pass <code>baseId</code>, you don't need to pass <code>description</code>!</strong></em></p>",
			example: [
				'[POST] URL /challenge',
				'PARAMETERS { receiverId : "52cc9cd3515sab4d1554de49", description : "I dare you to drink water upside down!", reward : 50 }',
				'HEADERS X-AUTH-TOKEN = $2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
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
					"url": "http://youtube.com/ASfnNk=",
					"type": "video",
					"reward": 10,
					"likes": 0,
					"doubts": 1,
					"timestamp": "1390980083413",
					"_id": "52e8abf53d7dd12f76eeb1a8"
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
				[422, "error", "{ code : 16 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"challenge-model\">Challenge</a>"]
			],
			description: "Will try to recover a <a href=\"#\" data-trigger=\"challenge-model\">Challenge</a> by its $_id.</p>",
			example: [
				'[GET] URL /challege/52e8abf53d7dd12f76eeb1a8',
				'PARAMETERS',
				'HEADERS',
				'STATUS 200 OK',
				{
					"info": {
						"description": "I dare you to walk with a horse mask!",
						"generalLikes": 0,
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
					"likes": 0,
					"doubts": 0,
					"timestamp": "1390980083413",
					"_id": "52e8abf53d7dd12f76eeb1a8"
				}
			]
		},
		{
			routeName: "/random",
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
				[401, "error", "{ code : 10 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"challengebase-model\">ChallengeBase []</a>"]
			],
			description: "Will try to get three random <a href=\"#\" data-trigger=\"challengebase-model\">ChallengeBases</a> (easy, medium, hard).</p>",
			example: [
				'[GET] URL /challenge/random',
				'PARAMETERS ',
				'HEADERS X-AUTH-TOKEN = $2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				[
				    {
				        "description": "Desafio 1",
				        "generalLikes": 0,
				        "def": true,
				        "difficulty": 0,
				        "timestamp": "1391216811599",
				        "_id": "52ec490dddcef68f6263fd54"
				    },
				    {
				        "description": "Desafio 2",
				        "generalLikes": 0,
				        "def": true,
				        "difficulty": 1,
				        "timestamp": "1391216811599",
				        "_id": "52ec490dddcef68f6263fd54"
				    },
				    {
				        "description": "Desafio 3",
				        "generalLikes": 0,
				        "def": true,
				        "difficulty": 2,
				        "timestamp": "1391216811599",
				        "_id": "52ec490dddcef68f6263fd54"
				    }
				]
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
				[401, "error", "{ code : 10 }"],
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
						"url": "http://youtube.com/ASfq@31=",
						"type": "video",
						"reward": 10,
						"likes": 0,
						"doubts": 0,
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
				[401, "error", "{ code : 10 }"],
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
							"generalLikes": 0,
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
						"likes": 0,
						"doubts": 0,
						"timestamp": "1390980083413",
						"_id": "52e8abf53d7dd12f76eeb1a8"
					}
				]
			]
		},
		{
			routeName: "/like",
			method: "POST",
			params: [
				[],
				[],
				["challengeId"],
				["challengeId"],
				["challengeId"],
				["challengeId"],
				["challengeId"],
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
				[401, "error", "{ code : 10 }"],
				[400, "error", "{ code : 7 }"],
				[422, "error", "{ code : 16 }"],
				[422, "error", "{ code : 17 }"],
				[422, "error", "{ code : 18 }"],
				[422, "error", "{ code : 19 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"challenge-model\">Challenge</a>"]
			],
			description: "Will try to set <code>liked</code> or <code>doubted</code> (depends of the challenge status) to <code>TRUE</code> on <a href=\"#\" data-trigger=\"likedoubt-model\">LikeDoubt</a> model.</p>",
			example: [
				'[POST] URL /challenge/like',
				'PARAMETERS { challengeId : "52e8abf53d7dd12f76eeb1a7" }',
				'HEADERS X-AUTH-TOKEN = $2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
				[
					{
						"info": {
							"description": "I dare you to walk with a horse mask!",
							"generalLikes": 0,
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
						"status": 1,
						"url": "http://youtube.com/ASfq@31=",
						"type": "video",
						"reward": 10,
						"likes": 4,
						"doubts": 123,
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
				[400, "error", "{ code : 7 }"],
				[400, "error", "{ code : 8 }"],
				[401, "error", "{ code : 10 }"],
				[422, "error", "{ code : 16 }"],
				[422, "error", "{ code : 20 }"],
				[422, "error", "{ code : 21 }"],
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
						"generalLikes": 0,
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
					"likes": 5,
					"doubts": 1,
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
				[400, "error", "{ code : 7 }"],
				[401, "error", "{ code : 10 }"],
				[422, "error", "{ code : 16 }"],
				[422, "error", "{ code : 20 }"],
				[422, "error", "{ code : 21 }"],
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
						"generalLikes": 0,
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
					"likes": 0,
					"doubts": 2,
					"timestamp": "1391001669782",
					"_id": "52e9009e0d8fe3510199b119"
				}
			]
		}
	]
});

controllers.push({
	name: "feed",
	show: "Feed",
	routes: [
		{
			routeName: "/",
			method: "GET",
			params: [
				[],
				[],
				["limit"],
				["limit", "offset"],
			],
			headers: [
				[],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],
				["X-AUTH-TOKEN"],			],
			returns: [
				[401, "error", "{ code : 10 }"],
				[400, "error", "{ code : 25 }"],
				[400, "error", "{ code : 26 }"],
				[200, "success", "<a href=\"#\" data-trigger=\"feed-model\">Feed</a>"]
			],
			description: "Will try to recover the user's <a href=\"#\" data-trigger=\"feed-model\">Feed (include his notifications and notifications from his follows</a>.",
			example: [
				'[GET] URL /feed',
				'PARAMETERS { limit : 1, offset : 0 }',
				'HEADERS X-AUTH-TOKEN = $2a$12$tL1ViLRmodnC1d4oAbFzIOYdd2BO5eutgdhI39OsqGVBnRWaF2E2O',
				'STATUS 200 OK',
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
				    }
				]
			]
		},
	]
});

exports.getControllers = function()
{
	return controllers;
}
