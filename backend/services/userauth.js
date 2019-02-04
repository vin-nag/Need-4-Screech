const { db, mongoUid } = require("./db")

// check if fields contain correct data and call signUp() if so
const signUp = (data, cb) => {

	if (data.username === "" || data.email === "" || data.password === "" || data.confirmPass === "") {

		console.log("one or more fields are empty");
		cb(true);
	}

	if (data.password.length < 6) {
	
		console.log("password must be at least 6 characters");
		cb(true);
	}

	if (data.username.length < 4) {

		console.log("username must be 4 or more characters");
		cb(true);
	}

	if (data.password !== data.confirmPass) {

		console.log("passwords do not match");
		cb(true);
	}

	if (validateEmail(data.email) === false) {

		 console.log("incorrect email");
		 cb(true);
	}

	else {

		cb(false);
		
	}

}

// login user if credentials correct
const login = (data, cb) => {

	db.users.findOne({
        username: data.username, password: data.password
    }, function(err, doc) {
        
        if(err || doc == null) {
        	console.error(err);
        	cb(true)
        } 
        else {
        	console.log(doc + "login successful")
        	cb(false);
        }
    })

}

// save user to database if unique and no errors
const registerUser = (user, cb) => {

	db.users.ensureIndex({email : 1}, {unique : true});
	db.users.ensureIndex({username : 1}, {unique : true});
	db.users.save(user, function(error, savedUser) {

		if (error || !savedUser) { 
			console.log("User " + user.email + " was not saved because of " + error);
			cb(true);
		}
		else { console.log("user saved");
			cb(false);
		}

	});

}

// function to validate email in format anystring@anything.anystring
const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}


module.exports = {

	signUp,
	login,
	registerUser

}








