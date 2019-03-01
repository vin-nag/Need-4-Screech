const { db, mongoUid } = require("./db")

class UserAuth {
    
    // calls signUP() if all the fields contain the correct data.
    validateRegistration(data, cb){

        if (data.username === "" || data.email === "" || data.password === "" || data.confirmPass === "") {
            cb({
                success: false,
                errors: ["One or more fields are emtpy."]
            });
        }

        if (data.password.length < 6) {
            cb({
                success: false,
                errors: ["Password must be at least 6 characters."]
            });
        }

        if (data.username.length < 4) {
            cb({
                success: false,
                errors: ["Username must consist of 4 or more characters."]
            });
        }

        if (data.password !== data.confirmPass) {
            cb({
                success: false,
                errors: ["Passwords do not match."]
            });
        }

        if (this.validateEmail(data.email) === false) {
            cb({
                success: false,
                errors: ["Incorrect e-mail"]
            });;
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
            username: data.username, password: data.password
        }, function(err, doc) {
            if(err || doc == null) {
                cb({
                    success: false,
                    errors: [err]
                });
            } 
            else {
                cb({
                    success: true,
                    errors: []
                });
            }
        })

    }

    // save user to database if unique and no errors
    registerUser(user, cb){

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

    }

    // function to validate email in format anystring@anything.anystring
    validateEmail(email){
        let re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}

module.exports = new UserAuth()









