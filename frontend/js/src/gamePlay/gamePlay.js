import socketClient from "../socketClient"

class GamePlay {
    constructor(){
        this.paused = false
        this.entities = []
        this.sessionID = null
    }

    getEntities(entities) {
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