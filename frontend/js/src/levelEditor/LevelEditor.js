import socketClient from "../socketClient";
import { levelEditor as config } from "../../../../config"

class LevelEditor {
    constructor(){
        this.paused = false
        this.sessionId = null
        this.entities = []
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
        if(this.selectedEntity != null){
            this.selectedEntity = null
        }
        else{
            let xClick = event.x
            let yClick = event.y
            for (let entity of this.entities){
                let boundingBox = entity.componentMap["CBoundingBox"]
                let xRange = entity.componentMap["CTransform"].position.x + boundingBox.size.x
                let yRange = entity.componentMap["CTransform"].position.y + boundingBox.size.y
                let inXrange = xClick >= entity.componentMap.size.position.x && xClick <= xRange
                let inYrange = yClick >= entity.componentMap.size.position.y && yClick <= yRange
                if (inXrange && inYrange){
                    socket.emit("setSelectedEntity", {
                        "selectedEntity": entity,
                        "sessionId": this.sessionId
                    })
                    break
                }
            }
        }
    }

    handleMouseMove(event){
        if (this.selectedEntity != null){
            socket.emit("updateEntityPosition", {
                "event": event,
                "sessionId": this.sessionId
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

}

export default LevelEditor
