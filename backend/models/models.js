// user model
user = (username, email, password, score=0, levels=[]) => ({username, email, password, score, levels})

// level model
level = (levelName, entities=[], owner) => ({levelName, entities, owner})

module.exports = {
	user,
	level
}


