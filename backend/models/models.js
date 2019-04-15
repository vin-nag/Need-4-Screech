// user model
user = (username, email, password, score=0, levels=[]) => ({username, email, password, score, levels})

// level model
level = (levelName, entities=[], owner) => ({levelName, entities, owner})

//change password
change = (username, password, newPass, confirmPass) => ({username, password, newPass, confirmPass})

module.exports = {
	user,
	level,
	change
}


