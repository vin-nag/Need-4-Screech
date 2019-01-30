// user model
function user(username, email, password) {

	this.username = username;
	this.email = email;
	this.password = password;
}


function login() {

	var username = document.getElementById('loginUsername').value;
	var password = document.getElementById('loginPassword').value;
	
}

function signUp() {

	var username = document.getElementById('signUpUsername').value;
	var email = document.getElementById('signUpEmail').value;
	var password = document.getElementById('signUpPassword').value;
	var confirmPass = document.getElementById('signUpConfirm').value;


	if (username === "" || email === "" || password === "" || confirmPass === "") {

		alert("one or more fields are empty");
	}

	if (password.length < 6) {
	
		alert("password must be at least 6 characters");
	}


	if (username.length < 4) {

		alert("username must be 4 or more characters");
	}

	if (password !== confirmPass) {

		alert("passwords do not match");
	}

	if (validateEmail(email) === false) {

		 alert("incorrect email");
	}

	else {

		user = new user(username, email, password);
		registerUser(user);
	}

}

// function to validate email in format anystring@anything.anystring
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function registerUser(user) {

	//const db = require('./db.js').db;

	db.users.ensureIndex({email : 1}, {unique : true});
	db.users.ensureIndex({username : 1}, {unique : true});
	db.users.save(user, function(err, savedUser) {

		if (err || !savedUser) { console.log("User " + user.email + " was not saved because of " + err)}
		else { alert("user saved"); }


	});

}






