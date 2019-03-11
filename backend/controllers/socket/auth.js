const UserAuth = require("../../services/UserAuth")
const models = require("../../models/models")

const onSignUp = (socket, data) => {
    UserAuth.validateRegistration(data, (res) => {
        if(!res.success) {
            socket.emit('signUpResponse',{success:false});
        }
        else {
            new_user = models.user(data.username, data.email, data.password)
            UserAuth.registerUser(new_user, (res) => {

                if(!res.success) {
                    socket.emit('signUpResponse',{success:false})
                }
                else {
                    socket.emit('signUpResponse',{success:true})
                }
            });
        }
    });
}

const onLogin = (socket, data) => {
    UserAuth.login(data, function(res) {
        if(!res.success) {
            socket.emit('signInResponse',{success:false})
        }
        else {
            socket.emit('signInResponse',{success:true})
        }
    });
}

module.exports = {
    onSignUp,
    onLogin
}