const connectController = require("./connect")
const disconnectController = require("./disconnect")
const testController = require("./test")
const UserAuth = require("../../services/UserAuth")
const models = require("../../models/models")
const gamePlayState = require("./../../game_engine/game_play");
const player = gamePlayState.player;
const update = gamePlayState.update();

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
            if(!res.success) {
                socket.emit('signUpResponse',{success:false});
            }
            else {
                new_user = models.user(data.username, data.email, data.password)
                UserAuth.registerUser(new_user, (res) => {

                    if(!res.success) {
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
            if(!res.success) {
                socket.emit('signInResponse',{success:false});
            }
            else {
                socket.emit('signInResponse',{success:true});
            }
        });
    });

    // input listeners
    socket.on('onKeyDown', (data) => {
        let CInput = getComponent('CInput');
        if (data.keyDown == 87) {
            CInput.up = true;
            console.log("W Pressed")
        }
        if (data.keyDown == 65) {
            CInput.left = true;
            console.log("A Pressed")
        }
        if (data.keyDown == 83) {
            CInput.down = true;
            console.log("S Pressed")
        }
        if (data.keyDown == 68) {
            CInput.right = true;
            console.log("D Pressed")
        }
        if (data.keyDown == 32) {
            CInput.shoot = true;
            console.log("Space Pressed")
        }
        update;
        console.log(player.getComponent("CInput"));
        console.log("Update Down: ", update[0].getComponent("CInput"))
        
    });

    socket.on('onKeyUp', (data) => {
        let CInput = getComponent('CInput');
        if (data.keyUp == 87) {
            CInput.up = false;
            console.log("W Released")
        }
        if (data.keyUp == 65) {
            CInput.left = false;
            console.log("A Released")
        }
        if (data.keyUp == 83) {
            CInput.down = false;
            console.log("S Released")
        }
        if (data.keyUp == 68) {
            CInput.right = false;
            console.log("D Released")
        }
        if (data.keyUp == 32) {
            CInput.shoot = false;
            console.log("Space Released")
        }

        update;
        console.log(player.getComponent("CInput"));
        console.log("Update Up: ", update[0].getComponent("CInput"))
    })

    // emit player compoents back to frontend
    socket.emit('updatePlayer', (data) => {
       
    })

    
}

module.exports = {
    listen
};