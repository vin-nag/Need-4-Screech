const connectController = require("./connect")
const disconnectController = require("./disconnect")
const testController = require("./test")
const authController = require("./auth")
const inputController = require("./input")
const UserAuth = require("../../services/UserAuth")
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

    // ********************************** Level Editor Listeners *****************************************

    // Save level listener.
    socket.on('saveLevel', (data) =>{

        db.levels.findOne({levelName: data.levelName}, function(err, res){
            if(err || res != null){
                socekt.emit('saveLevelResponse', {success: false, errors: [err]})
            }
            else{
                new_level = models.level(data.levelName, data.entities)
                db.levels.save(new_level)
                socket.emit('saveLevelResponse', {success: true, errors:[]})
            }
        })
    })


    // Load level listener.
    socket.on('loadLevel', (data)=>{
        db.levels.findOne({levelName: data.levelName}, function(err, res){
            if(err || res == null){
                socket.emit('loadLevelResponse', {success: false, errors: [err]})
            }
            else{
                socket.emit('loadLevelResponse', {success: true, errors:[], res})
            }
        })
    })
  
    socket.on("onSignUp", data => authController.onSignUp(socket, data))
    socket.on("onLogin", data => authController.onLogin(socket, data))
    // socket.on("onKeyDown", data => inputController.onKeyDown(socket, data))
    // socket.on("onKeyUp", data => inputController.onKeyUp(socket, data)) 

}

module.exports = {
    listen
};