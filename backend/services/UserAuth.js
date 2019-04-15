const { db } = require("./db")
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserAuth {
    
    // calls signUP() if all the fields contain the correct data.
    validateRegistration(data, cb){
        let emptyFields = (data.username === "" || data.email === "" || data.password === "" || data.confirmPass === "")
        let incorrectFields = (data.password.length < 6 || data.username.length < 4 || data.password !== data.confirmPass || this.validateEmail(data.email) === false)
        if (emptyFields) {
            cb({
                success: false,
                errors: ["One or more fields are emtpy."]
            })
        }
        else if(incorrectFields){
            let errorArray = []
            if (data.password.length < 6) {
                errorArray.push("Password must be at least 6 characters.")
            }
            if (data.username.length < 4) {
                errorArray.push("Username must consist of 4 or more characters.")
            }
            if (data.password !== data.confirmPass) {
                errorArray.push("Passwords do not match.")
            }
            if (this.validateEmail(data.email) === false) {
                errorArray.push("Incorrect e-mail")
            }
            cb({
                success: false,
                errors: errorArray
            })
        }
        else {
            cb({
                success: true,
                errors: []
            });
        }
    }

    // login user if credentials correct
    login(data, cb){
        db.users.findOne({
            username: data.username
        }, function(err, doc) {
            
            if(err || doc == null) {
                cb({
                    success: false,
                    errors: ["Missing or Incorrect Login Details."]
                });
            } 
            else {
                bcrypt.compare(data.password, doc.password).then(function(res) {

                    if (res) {
                        cb({
                            success: true,
                            errors: []
                        });
                    }
                    else {
                        cb({
                            success: false,
                            errors: ["Missing or Incorrect Login Details."]
                        });
                    }

                });

            }
        })

    }

    // save user to database if unique and no errors
    registerUser(user, cb){
        bcrypt.hash(user.password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            user.password = hash
            db.users.createIndex({email : 1}, {unique : true});
            db.users.createIndex({username : 1}, {unique : true});
            db.users.save(user, function(error, savedUser){
                if (error || !savedUser) { 
                    cb({
                        success: false,
                        errors: [error]
                    });
                }
                else {
                    cb({
                        success: true,
                        errors: []
                    });
                }
    
            });
        });


    }

    // function to validate email in format anystring@anything.anystring
    validateEmail(email){
        let re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}

module.exports = new UserAuth()









