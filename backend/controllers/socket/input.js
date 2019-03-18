const gameSessionService = require("./../../services/GameSessionService");

const onKeyDown = (socket, data) => {
    let session = gameSessionService.getSession(data.sessionID);
    session.lastInput = {event:'onKeyDown', keyDown:data.keyCode};
};

const onKeyUp = (socket, data) => {
    let session = gameSessionService.getSession(data.sessionID);
    session.lastInput = {event:'onKeyUp', keyUp:data.keyCode};
};

const onNewSession = (socket, data) => {
    let sessionID = gameSessionService.addSession()
    socket.emit('newSessionID', {
        session: sessionID,
        issuer: data.issuer
    })
};

module.exports = {
    onKeyDown,
    onKeyUp, 
    onNewSession
}