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
                errors: ["One or more fields are empty."]
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

    changePassword(data, cb) {
        let emptyFields = (data.username === "" || data.password === "" || data.newPass === "" || data.confirmPass === "")
        let incorrectFields = (data.newPass.length < 6 || data.newPass !== data.confirmPass)

        if (emptyFields) {
            cb({
                success: false,
                errors: ["One or more fields are empty."]
            })
        }
        else if (incorrectFields) {
            let errorArray = []
            if (data.newPass.length < 6) {
                errorArray.push("Password must be at least 6 characters.")
            }
            if (data.newPass !== data.confirmPass) {
                errorArray.push("Passwords do not match.")
            }
            cb({
                success: false,
                errors: errorArray
            })
        }
        else {
            const hash = bcrypt.hash(data.newPass, 10, function (err, hash) {
                if (!err){
                    db.users.update(
                        { username: data.username },
                        { $set: { password: hash } },
                        function (err, result) {
                            if (err){
                                cb({
                                    success: false,
                                    errors: ['error connecting db']
                                })
                            }
                            else {
                                cb({
                                    success: true,
                                    errors: []
                                })

                            }
                        }
                    );
                }
            })
        }
    }

    tempPassword(email, tempPass, cb) {
        const hash = bcrypt.hash(tempPass, 10, function(err, hash) {
            if (!err){
                db.users.update(
                    {email: email},
                    {$set: {password: hash}},
                    function (err, result) {
                        if (err){
                            cb({
                                success: false,
                                errors: ["That email does not exist"]
                            })
                        }
                        else {
                            cb({
                                success: true,
                                errors: []
                            })
                        }
                        
                    }
                );
            }
        })
    }
}

module.exports = new UserAuth()









