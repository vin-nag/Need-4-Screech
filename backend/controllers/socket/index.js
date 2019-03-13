const connectController = require("./connect")
const disconnectController = require("./disconnect")
const testController = require("./test")
const authController = require("./auth")
const inputController = require("./input")

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
    socket.on("onSignUp", data => authController.onSignUp(socket, data))
    socket.on("onLogin", data => authController.onLogin(socket, data))
    socket.on("onKeyDown", data => inputController.onKeyDown(socket, data))
    socket.on("onKeyUp", data => inputController.onKeyUp(socket, data)) 
    socket.on("newSessionID", data => inputController.onNewSession(socket, data)) 


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
}

module.exports = {
    listen
};