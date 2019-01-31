const { db, mongoUid } = require("./db")
// user model
// const user = (username, email, password, score=0, levels=[]) => ({username, email, password, score, levels})

function user(username, email, password) {

	this.username = username;
	this.email = email;
	this.password = password;

}

// function to validate email in format anystring@anything.anystring
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function registerUser(user) {

	db.users.ensureIndex({email : 1}, {unique : true});
	db.users.ensureIndex({username : 1}, {unique : true});
	db.users.save(user, function(error, savedUser) {

		if (error || !savedUser) { console.log("User " + user.email + " was not saved because of " + error)}
		else { console.log("user saved"); }

	});

}

module.exports = {

	signUp(username, email, password, confirmPass) {


		if (username === "" || email === "" || password === "" || confirmPass === "") {

			console.log("one or more fields are empty");
		}

		if (password.length < 6) {
		
			console.log("password must be at least 6 characters");
		}


		if (username.length < 4) {

			console.log("username must be 4 or more characters");
		}

		if (password !== confirmPass) {

			console.log("passwords do not match");
		}

		if (validateEmail(email) === false) {

			 console.log("incorrect email");
		}

		else {

			user = new user(username, email, password);
			registerUser(user);
		}

	}

	
}







