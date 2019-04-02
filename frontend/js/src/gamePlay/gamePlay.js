import socketClient from "../socketClient"
import app from "../app"
import APP_WINDOWS from "../../enums/app_windows"
import domService from "../services/dom"

class GamePlay {
    constructor(){
        this.paused = false
        this.entities = []
        this.sessionID = null
        this.updateStateInterval = null
        this.currentLevel = ""
        this.levelsCompleted = [false, false, false]
    }

    run(){
        this.updateStateInterval = setInterval(() => this.requestStateUpdate(), 50)
    }

    stop(){
        clearInterval(this.updateStateInterval)
        this.updateStateInterval = null

        socketClient.emit("removeSession", {
            sessionId: this.sessionID
        })
        this.sessionID = null
    }

    requestStateUpdate(){
        socketClient.emit("requestGameStateUpdate", {
            sessionId: this.sessionID
        })
    }

    setEntities(entities) {
        this.entities = entities;
    }

    setSession(sessionID) {
        this.sessionID = sessionID
    }

    handleKeyPress(event) {
        if (event.type === 'keydown') {
            socketClient.emit('onKeyDown', {
                keyCode: event.keyCode,
                sessionID: this.sessionID
            })   
        }
        if (event.type === 'keyup') {
            socketClient.emit('onKeyUp', {
                keyCode: event.keyCode,
                sessionID: this.sessionID
            })
        }
    }

    handleButtonClick(e) {
        const player = this.entities.find(entity => entity.tag === "player")
        let level_state = player.componentMap['CLevelState']
        if (e.srcElement.id === "completeNext") {
            level_state.level_state = "ongoing"
            domService.hideElement("completeLevelModal")
            app.switchToWindow(APP_WINDOWS.OVERWORLD)
        }
        else if (e.srcElement.id === "restartLevel") {
            level_state.level_state = "ongoing"
            domService.hideElement("failedLevelModal")
            this.stop();
            this.newSessionId();
            this.run();
        }
        else if (e.srcElement.id === "quitLevel") {
            level_state.level_state = "ongoing"
            domService.hideElement("failedLevelModal")
            app.switchToWindow(APP_WINDOWS.OVERWORLD)
        }

    }

    showModal(state) {
        if (state === "complete") {
            domService.showElement("completeLevelModal")
            if (this.currentLevel === "George Street") {
                this.levelsCompleted = [true, false, false]
            }
            else if (this.currentLevel === "Memorial University") {
                this.levelsCompleted = [true, true, false]
            }
            else if (this.currentLevel === "Cape Spear") {
                this.levelsCompleted = [true, true, true]
            }

            console.log(this.levelsCompleted)
        }
        else if (state === "failed") {
            domService.showElement("failedLevelModal")
        }
    }

    newSessionId() {
        socketClient.emit('newSessionID', {
            issuer: "GAME_PLAY"
        })
    }

    setCurrentLevel(level) {
        this.currentLevel = level
    }
}

export default GamePlay