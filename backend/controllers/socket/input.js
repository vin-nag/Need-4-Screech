const gameSessionService = require("./../../services/GameSessionService");
//const config = require("./../../config-template.json");

const onKeyDown = (socket, data) => {
    let session = gameSessionService.getSession(data.sessionID);
    let key = data.keyCode;
    session.lastInput.event = 'onKeyDown';
    session.lastInput[key] = true;
};

const onKeyUp = (socket, data) => {
    let session = gameSessionService.getSession(data.sessionID);
    let key = data.keyCode;
    session.lastInput.event = 'onKeyUp';
    session.lastInput[key] = false;
    //session.lastInput = {event:'onKeyUp', keyUp:data.keyCode};
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