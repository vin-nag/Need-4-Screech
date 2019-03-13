const gameSessionService = require("./../../services/GameSessionService");

const onKeyDown = (socket, data) => {
    let session = gameSessionService.getSession(data.sessionId);
    //session.lastInput = {event:'onKeyDown', key:data.keyCode};
};

const onKeyUp = (socket, data) => {
    let session = gameSessionService.getSession(data.sessionId);
    //session.lastInput = {event:'onKeyUp', key:data.keyCode};
};

const onNewSession = (socket, data) => {
    let sessionID = gameSessionService.addSession()
    socket.emit('newSessionID', {
        session: sessionID
    })
};

module.exports = {
    onKeyDown,
    onKeyUp, 
    onNewSession
}