const gameSessionService = require("./../../services/GameSessionService");

const onRequestGameStateUpdate = (socket, data) => {
    const gameEngine = gameSessionService.getSession(data.sessionId)
    socket.emit("updateGameState", gameEngine.returnGameState())
}


module.exports = {
    onRequestGameStateUpdate
}