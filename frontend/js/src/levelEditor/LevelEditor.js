import socketClient from "../socketClient";
import { levelEditor as config } from "../../../../config"

class LevelEditor {
    constructor(){
        this.paused = false
        this.sessionId = null
        this.entities = []
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
        if(event.type === 'wheel'){
            socketClient.emit('onScroll',{
                event:event,
                sessionID:this.sessionId
            })
        }
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

}

export default LevelEditor
