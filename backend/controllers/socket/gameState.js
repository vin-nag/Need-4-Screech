const gameSessionService = require("./../../services/GameSessionService");
const { db } = require("../../services/db")
const models = require("../../models/models")

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

const onSaveLevel = (socket, data ) => {
    const errors = []

    if(!data.sessionId) { errors.push("Session id was not provided") }
    if(!data.levelName) { errors.push("Level name was not provided") }

    if(errors.length){
        socket.emit("saveLevelResponse", {
            success: false,
            errors
        })
        return
    }

    const gameEngine = gameSessionService.getSession(data.sessionId)
    const entities = gameEngine.entity_manager.getEntities()

    db.levels.findOne({levelName: data.levelName}, function(err, res){
        if(err || res != null){
            errors.push(err || "This level name already exists")
            socekt.emit('saveLevelResponse', {success: false, errors})
        }
        else{
            //TODO: Change the owner to the user id once auth is working fully
            const level = models.level(data.levelName, entities, "test3")

            db.levels.createIndex({levelName : 1, owner: 1}, {unique : true})
            db.levels.save(level, (err, element) => {
                if(err || !element){ errors.push(JSON.stringify(err) || "Failed to save level") }
                socket.emit("saveLevelResponse", {
                    success: errors.length === 0,
                    errors
                })
            })

        }
    })
}

module.exports = {
    onRequestGameStateUpdate,
    onRemoveSession,
    onSaveLevel
}