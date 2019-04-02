import socketClient from "../socketClient";
import { levelEditor as config } from "../../../../config"
import { controls } from "../../../../config-template"
import assetManager from "../services/assetManager"
import canvasService from "../services/canvas"

class LevelEditor {
    constructor(){
        this.paused = false
        this.sessionId = null
        this.entities = []
        this.inSelection = false
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
        if(this.inSelection){
            socketClient.emit("setSelectedEntity", {
                "selectedEntity": null,
                "sessionId": this.sessionId
            })
            this.inSelection = false
        }
        else{
            const canvasRect = document.getElementById("levelEditorCanvas").getBoundingClientRect()
            const { left: offsetLeft, top: offsetTop } = canvasRect

            let xClick = event.x - offsetLeft
            let yClick = event.y - offsetTop
            for (let entity of this.entities){
                if(entity.tag === "bg-img"){ continue }
                const animation = entity.componentMap["CAnimation"]
                const animationImg = assetManager.getAnimationImage(animation.animName)

                const height = animationImg.height
                const width = animationImg.width / animation.numOfFrames

                let xRange = entity.componentMap["CTransform"].position.x + width
                let yRange = entity.componentMap["CTransform"].position.y + height
                let inXrange = xClick >= entity.componentMap["CTransform"].position.x && xClick <= xRange
                let inYrange = yClick >= entity.componentMap["CTransform"].position.y && yClick <= yRange

                if (inXrange && inYrange){
                    socketClient.emit("setSelectedEntity", {
                        "selectedEntity": entity.id,
                        "sessionId": this.sessionId
                    })
                    
                    this.inSelection = true
                    break
                }
            }
        }
    }

    handleMouseMove(event){
        const canvas = document.getElementById("levelEditorCanvas")
        const canvasRect = canvas.getBoundingClientRect()
        const { left, top } = canvasRect

        const player = this.entities.find(entity => entity.tag === "player")
        const {camX, camY} = canvasService.calc.viewportOffset(player, canvas)

        socketClient.emit("updateEntityPosition", {
            x: event.x - left - camX,
            y: event.y - top - camY,
            "sessionId": this.sessionId
        })
    }

    handleMouseWheel(event){
        //Stub: Map scroll wheel movement to level editor functions (likely changing
        //the animation of the selected entity)
    }

    handleKeyPress(event){
        if (event.type === 'keydown') {
            if(event.keyCode === parseInt(controls.delete)){ this.inSelection = false }
            else if(event.keyCode === parseInt(controls.new)){ this.inSelection = true }
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
