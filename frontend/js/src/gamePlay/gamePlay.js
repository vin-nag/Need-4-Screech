import socketClient from "../socketClient"

class GamePlay {
    constructor(){
        this.paused = false
        this.entities = []
        this.sessionID = null
        this.updateStateInterval = null
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

    newSessionId() {
        socketClient.emit('newSessionID', {
            sessionID: this.sessionID
        })
    }
}

export default GamePlay