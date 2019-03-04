const connectController = require("./connect")
const disconnectController = require("./disconnect")
const testController = require("./test")
const UserAuth = require("../../services/UserAuth")
const models = require("../../models/models")
const gamePlayState = require("./../../game_engine/game_play");

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

    // input listener
    socket.on('onInput', (data) => {
        if (data.keyPressed == 87) {
            //player.CInput.up = true;
            console.log("W Pressed")
        }
        if (data.keyPressed == 67) {
            //player.CInput.left = true;
            console.log("A Pressed")
        }
        else if (data.keyPressed == 83) {
            //player.CInput.down = true;
            console.log("S Pressed")
        }
        else if (data.keyPressed == 68) {
            //player.CInput.right = true;
            console.log("A Pressed")
        }
        
    });

    socket.on('onKeyUp', (data) => {
        if (data.keyUp == 87) {
            //player.CInput.up = false;
            console.log("W Released")
        }
        if (data.keyUp == 65) {
            //player.CInput.left = false;
            console.log("A Released")
        }
        else if (data.keyUp == 83) {
            //player.CInput.down = false;
            console.log("S Released")
        }
        else if (data.keyUp == 68) {
            //player.CInput.right = false;
            console.log("A Released")
        }
    })
}

module.exports = {
    listen
}