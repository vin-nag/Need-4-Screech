const connectController = require("./connect")
const disconnectController = require("./disconnect")
const testController = require("./test")
const UserAuth = require("../../services/userauth")
const models = require("../../models/models")

/**
 * Listens to the io object passed for a connection event,
 * and connects the socket controllers to the passed socket
 * object.
 *  */
const listen = (io) => {
    io.on("connection", socket => connectControllers(socket))
}

const connectControllers = (socket) => {
    //connectController and disconnectController should not expect
    //data payloads
    
    connectController(socket)
    socket.on("disconnect", () => disconnectController(socket))
    socket.on("test", data => testController(socket, data))

    // signup listener
    socket.on('onSignUp',(data) => {

        UserAuth.validateRegistration(data, (res) => {

            if(res) {
                socket.emit('signUpResponse',{success:false});
            }

            else {

                new_user = models.user(data.username, data.email, data.password)
                UserAuth.registerUser(new_user, (res) => {

                    if(res) {
                        socket.emit('signUpResponse',{success:false});
                    }
                    else {
                        socket.emit('signUpResponse',{success:true});
                    }
                    
                });
            }
        });
       
    });

    // login listener
    socket.on('onLogin', (data) => {

    	UserAuth.login(data, function(res) {

            if(res) {
                socket.emit('signInResponse',{success:false});
            }

            else {
                socket.emit('signInResponse',{success:true});
            }
        });

    });
}

module.exports = {
    listen
}