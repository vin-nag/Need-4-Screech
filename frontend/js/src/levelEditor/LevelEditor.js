import socketClient from "../socketClient";
import { levelEditor as config } from "../../../../config"

class LevelEditor {
    constructor(){
        this.paused = false
        this.sessionId = null
        this.entities = []
        this.selectedEntity = null
        this.updateStateInterval = null
    }

    newSessionId() {
        socketClient.emit('newSessionID', {
            issuer: "LEVEL_EDITOR"
        })
    }

    run(){
        this.updateStateInterval = setInterval(() => this.requestStateUpdate(), config.updateRate)
    }

    stop(){
        clearInterval(this.updateStateInterval)
        this.updateStateInterval = null

        socketClient.emit("removeSession", {
            sessionId: this.sessionId
        })
        this.sessionId = null
    }

    requestStateUpdate(){
        socketClient.emit("requestGameStateUpdate", {
            sessionId: this.sessionId
        })
    }

    setEntities(entities) {
        this.entities = entities
    }

    setSession(sessionId) {
        this.sessionId = sessionId
    }

    saveLevel(levelName){
        //Stub: Sends the entities array to the backend, in order to
        //save the level, and awaits confirmation
        socketClient.emit("saveLevel", {
            "levelName": levelName,
            "sessionId": this.sessionId
        })
    }

    loadLevel(levelId){
        //Stub: Calls the backend to request the entities stored for
        //the given level. On success, updates the local gameState
        //accordingly. On failure, displays the corresponding error message
        socketClient.emit('loadLevel', {
            levelId,
            sessionId: this.sessionId
        })

    }

    handleClick(event){
        //Stub: Figures out whether an entity as already selected or not.
        //If yes, deselects the entity. If not, checks if an entity is located
        //at the click pos, and if so sets it as selected
    }

    handleMouseMove(event){
        if (this.selectedEntity != null){
            socket.emit("updatePosition", {
                "entity": this.selectedEntity,
                "event": event
            })
        }
    }

    handleMouseWheel(event){
        //Stub: Map scroll wheel movement to level editor functions (likely changing
        //the animation of the selected entity)
    }

    handleKeyPress(event){
        //Stub: Map key presses to level editor functions
    }

    setEntities(loadedEntites){
        this.entities = loadedEntites
    }

}

export default LevelEditor
