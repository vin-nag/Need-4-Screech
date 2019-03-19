const gameSessionService = require("./../../services/GameSessionService");

const onKeyDown = (socket, data) => {
    let session = gameSessionService.getSession(data.sessionID);
    session.lastInput.event = 'onKeyDown';
    session.lastInput[data.keyCode] = true;
};

const onKeyUp = (socket, data) => {
    let session = gameSessionService.getSession(data.sessionID);
    session.lastInput.event = 'onKeyUp';
    session.lastInput[data.keyCode] = false;
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