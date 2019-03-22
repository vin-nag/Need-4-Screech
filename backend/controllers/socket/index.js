const connectController = require("./connect")
const disconnectController = require("./disconnect")
const testController = require("./test")
const authController = require("./auth")
const inputController = require("./input")
const gameStateController = require("./gameState")
const assetsController = require("./assets")

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
    socket.on("removeSession", data => gameStateController.removeSession(socket, data))
    socket.on("requestGameStateUpdate", data => gameStateController.onRequestGameStateUpdate(socket, data))
    socket.on("saveLevel", data => gameStateController.onSaveLevel(socket, data))
    socket.on("listLevels", data => gameStateController.onListLevels(socket, data))
    socket.on('loadLevel', (data)=> gameStateController.onLoadLevel(socket, data))
    socket.on("getAnimationsList", data => assetsController.onGetAnimationsList(socket, data))
}

module.exports = {
    listen
};