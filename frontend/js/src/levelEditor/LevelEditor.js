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
        socketClient.emit("saveLevel", {
            "levelName": levelName,
            "sessionId": this.sessionId
        })
    }

    loadLevel(levelId){
        socketClient.emit('loadLevel', {
            levelId,
            sessionId: this.sessionId
        })

    }

    handleClick(event){
        //Stub: Figures out whether an entity as already selected or not.
        //If yes, deselects the entity. If not, checks if an entity is located
        //at the click pos, and if so sets it as selected
        if(this.selectedEntity != null){
            this.selectedEntity = null
        }
        else{
            let xClick = event.x
            let yClick = event.y
            for (let entity of this.entities){
                let xRange = entity.componentMap.position.x // add image width
                let yRange = entity.componentMap.position.y // add image height
                let inXrange = xClick >= entity.componentMap.position.x && xClick <= xRange
                let inYrange = yClick >= entity.componentMap.position.y && yClick <= yRange
                if (inXrange && inYrange){
                    this.selectedEntity = entity
                }
            }
        }
    }

    handleMouseMove(event){
        if (this.selectedEntity != null){
            socket.emit("updateEntityPosition", {
                "entity": this.selectedEntity,
                "event": event
            })
        }
    }

    handleMouseWheel(event){
        //Stub: Map scroll wheel movement to level editor functions (likely changing
        //the animation of the selected entity)
        let threshold = 0.8
        if (event.deltaY >= threshold){
            // set new animation
        }

    }

    handleKeyPress(event){
        //Stub: Map key presses to level editor functions
    }

}

export default LevelEditor
