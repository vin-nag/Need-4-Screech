const { db, mongoUid } = require("./db")

// user model
user = (username, email, password, score=0, levels=[]) => ({username, email, password, score, levels})

// check if fields contain correct data and call signUp() if so
const signUp = (data) => {

	if (data.username === "" || data.email === "" || data.password === "" || data.confirmPass === "") {

		console.log("one or more fields are empty");
	}

	if (data.password.length < 6) {
	
		console.log("password must be at least 6 characters");
	}

	if (data.username.length < 4) {

		console.log("username must be 4 or more characters");
	}

	if (data.password !== data.confirmPass) {

		console.log("passwords do not match");
	}

	if (validateEmail(data.email) === false) {

		 console.log("incorrect email");
	}

	else {

		new_user = user(data.username, data.email, data.password);
		registerUser(new_user);
	}

}

// login user if credentials correct
const login = (data) => {

	db.users.find({
        username: data.username, password: data.password
    }, function(err, doc) {
        console.log(doc + "login successful" )
        if(err) console.error(err)
    })

}

// save user to database if unique and no errors
const registerUser = (user) => {

	db.users.ensureIndex({email : 1}, {unique : true});
	db.users.ensureIndex({username : 1}, {unique : true});
	db.users.save(user, function(error, savedUser) {

		if (error || !savedUser) { console.log("User " + user.email + " was not saved because of " + error)}
		else { console.log("user saved"); }

	});

}

// function to validate email in format anystring@anything.anystring
const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}


module.exports = {

	signUp,
	login

}








