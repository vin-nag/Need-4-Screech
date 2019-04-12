
const gameSessionService = require("./../../services/GameSessionService");
const { db, mongoUid } = require("../../services/db")
const models = require("../../models/models")

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

    const asEditor = data.issuer === "LEVEL_EDITOR"
    const gameEngine = gameSessionService.getSession(sessionID)
    gameEngine.setEditorMode(asEditor)

    setTimeout(() => {
        if(!asEditor){
            const entities = gameEngine.entity_manager.getEntities().filter(entity => !["deliveries_left","screech_remaining", "score", "game_bar", "taxi"].includes(entity.tag))
            console.log(entities.length)
            const errors = []
    
            db.levels.findOne({levelName: data.levelName}, function(err, res){
                if(err || res != null){
                    errors.push(err || "This level name already exists")
                    socket.emit('saveLevelResponse', {success: false, errors})
                }
                else{
                    const level = models.level("george-street", entities, null)
    
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
    }, 1000)

    socket.emit('newSessionID', {
        session: sessionID,
        issuer: data.issuer
    })
};

const onClick = (socket, data)=>{
    let session = gameSessionService.getSession(data.sessionID);
    session.lastInput.event = 'onClick';
};


module.exports = {
    onKeyDown,
    onKeyUp,
    onClick,
    onNewSession
}