//TODO: Delegate input => CInput mapping to the gameEngine
//TODO: Use data.gameSessionId and pass it to the GameSessionService

const gameSessionService = require("./../../services/GameSessionService");

const onKeyDown = (socket, data) => {
    let session = gameSessionService.getSession(data.sessionId);
    session.lastInput = {event:'onKeyDown', key:data.keyCode};
};

const onKeyUp = (socket, data) => {
    let session = gameSessionService.getSession(data.sessionId);
    session.lastInput = {event:'onKeyUp', key:data.keyCode};
};