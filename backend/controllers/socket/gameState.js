const gameSessionService = require("./../../services/GameSessionService");

const onRequestGameStateUpdate = (socket, data) => {
    if(!data.sessionId) { return }
    const gameEngine = gameSessionService.getSession(data.sessionId)
    socket.emit("updateGameState", {
        gameState: gameEngine.returnGameState()
    })

}


module.exports = {
    onRequestGameStateUpdate
}