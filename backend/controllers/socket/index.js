const connectController = require("./connect")
const disconnectController = require("./disconnect")
const testController = require("./test")

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
    
    connectController()
    socket.on("disconnect", () => disconnectController())
    socket.on("test", data => testController(data))
}

module.exports = {
    listen
}