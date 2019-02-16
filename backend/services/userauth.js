const { db, mongoUid } = require("./db")

class UserAuth {
    
    // calls signUP() if all the fields contain the correct data.
    validateRegistration(data, cb){

        if (data.username === "" || data.email === "" || data.password === "" || data.confirmPass === "") {
            console.log("One or more fields empty.")
            cb({
                success: true,
                errors: ["One or more fields are emtpy."]
            });
        }

        if (data.password.length < 6) {
            cb({
                success: true,
                errors: ["Password must be at least 6 characters."]
            });
        }

        if (data.username.length < 4) {
            cb({
                success: true,
                errors: ["Username must consist of 4 or more characters."]
            });
        }

        if (data.password !== data.confirmPass) {
            cb({
                success: true,
                errors: ["Passwords do not match."]
            });
        }

        if (this.validateEmail(data.email) === false) {
            cb({
                success: true,
                errors: ["Incorrect e-mail."]
            });;
        }

        else {
            cb({
                success: false,
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
                    success: true,
                    errors: [err]
                });
            } 
            else {
                cb({
                    success: false,
                    errors: [doc, "One or more fields are emtpy."]
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
                    success: true,
                    errors: ["User ", user.email, " was not saved because of ", error]
                });
            }
            else {
                cb({
                    success: false,
                    errors: ["User saved."]
                });
            }

        });

    }

    // function to validate email in format anystring@anything.anystring
    validateEmail(email){
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}

module.exports = new UserAuth()









