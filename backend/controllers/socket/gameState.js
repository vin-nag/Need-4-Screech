const gameSessionService = require("./../../services/GameSessionService");

const onRequestGameStateUpdate = (socket, data) => {
    if(!data.sessionId) { return }
    console.log(data)
    const gameEngine = gameSessionService.getSession(data.sessionId)
    console.log("game engine", gameEngine)
    console.log("game state", gameEngine.returnGameState())
    socket.emit("updateGameState", {
        gameState: gameEngine.returnGameState()
    })

}


module.exports = {
    onRequestGameStateUpdate
}