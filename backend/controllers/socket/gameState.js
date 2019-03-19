const gameSessionService = require("./../../services/GameSessionService");

const onRequestGameStateUpdate = (socket, data) => {
    if(!data.sessionId) { return }
    const gameEngine = gameSessionService.getSession(data.sessionId)
    socket.emit("updateGameState", {
        gameState: gameEngine.returnGameState(),
        sessionId: data.sessionId
    })

}

const onRemoveSession = (socket, data) => {
    if(!data.sessionId) { return }
    gameSessionService.removeSession(data.sessionId) 
}

module.exports = {
    onRequestGameStateUpdate,
    onRemoveSession
}