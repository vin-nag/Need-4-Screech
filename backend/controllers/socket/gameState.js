const gameSessionService = require("./../../services/GameSessionService");
const { db, mongoUid } = require("../../services/db")
const models = require("../../models/models")
const gameEngine = require("../game_engine/gameEngine")

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

const onListLevels = (socket, data) => {
    db.levels.find({}, {levelName: 1}, {limit: 25}, (err, res) => {
        if(err || !res) { 
            const error = err ? JSON.stringify(err) : "Did not find any levels"
            socket.emit("listLevelsResponse", {success: false, errors: [error]})
        }
        else{
            socket.emit("listLevelsResponse", {
                success: true,
                errors: [],
                levels: res
            })
        }
    })
}

const onLoadLevel = (socket, data) => {
    const errors = []

    if(!data.sessionId) { errors.push("Session id was not provided") }
    if(!data.levelId) { errors.push("Level id was not provided") }

    if(errors.length){
        socket.emit("loadLevelResponse", {success: false, errors})
        return
    }

    const gameEngine = gameSessionService.getSession(data.sessionId)

    db.levels.findOne({_id: mongoUid(data.levelId)}, function(err, res){
        if(err || res == null){
            console.log(res)
            socket.emit('loadLevelResponse', {success: false, errors: [err]})
        }
        else{
            gameEngine.loadSerializedEntities(res.entities)
            socket.emit('loadLevelResponse', {success: true, errors:[]})
        }
    })
}

const updateEntityPosition = (socket, data) => {
    let newXpos = data.event.x
    let newYpos = data.event.y
    let entityID = data.entityID
    let entities = gameEngine.entity_manager.getEntities()
    for (let item of entities){
        if(item.getId() == entityID){
            item.componentMap["CTransform"].position.x = newXpos
            item.componentMap["CTransform"].position.y = newYpos
        }
    }
}

const updateSelectedEntity = (socket, data) => {
    let entity = data.selectedEntity
    gameEngine.updateSelectedEntity(entity)
}

module.exports = {
    onRequestGameStateUpdate,
    onRemoveSession,
    onSaveLevel,
    onListLevels,
    onLoadLevel,
    updateEntityPosition,
    updateSelectedEntity
}