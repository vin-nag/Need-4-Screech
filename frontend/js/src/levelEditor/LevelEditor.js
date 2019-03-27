import socketClient from "../socketClient";
import { levelEditor as config } from "../../../../config"

class LevelEditor {
    constructor(){
        this.paused = false
        this.sessionId = null
        this.entities = []
        this.selectedEntity = null
        this.updateStateInterval = null

        this.entityType = {
            options: ["tile", "decoration", "player", "enemy", "powerup", "checkpoint"],
            selectedIndex: 0
        }
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

    changeEntityType(){
        //Increment with wrap around the set of available entity type options
        this.entityType.selectedIndex = (this.entityType.selectedIndex + 1) % this.entityType.options.length
        const entityType = this.entityType.options[this.entityType.selectedIndex]
        
        socketClient.emit("updateEditorEntityType", {
            sessionId: this.sessionId,
            entityType: this.entityType.options[this.entityType.selectedIndex]
        })

        alert(`Switched editor entity type to: ${entityType}`)
    }

    handleClick(event){
        //Stub: Figures out whether an entity as already selected or not.
        //If yes, deselects the entity. If not, checks if an entity is located
        //at the click pos, and if so sets it as selected
    }

    handleMouseMove(event){
        //Stub: If there is an entity selected, updates its position to that of
        //the cursor
    }

    handleMouseWheel(event){
        //Stub: Map scroll wheel movement to level editor functions (likely changing
        //the animation of the selected entity)
    }

    handleKeyPress(event){
        if (event.type === 'keydown') {
            socketClient.emit('onKeyDown', {
                keyCode: event.keyCode,
                sessionID: this.sessionId
            })   
        }

        if (event.type === 'keyup') {
            socketClient.emit('onKeyUp', {
                keyCode: event.keyCode,
                sessionID: this.sessionId
            })
        }
    }

    setEntities(loadedEntites){
        this.entities = loadedEntites
    }

}

export default LevelEditor
