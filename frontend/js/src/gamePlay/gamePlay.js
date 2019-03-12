import socketClient from "../socketClient"

class GamePlay {
    constructor(){
        this.paused = false
        this.entities = []
    }

    getEntities(entities) {
        this.entities = entities;
        console.log(this.entities)
    }

    handleKeyPress(event) {
        if (event.type === 'keydown') {
            socketClient.emit('onKeyDown', {
                keyCode: event.keyCode
            })   
        }
        if (event.type === 'keyup') {
            socketClient.emit('onKeyUp', {
                keyCode: event.keyCode
            })
        }
    }                       
}

export default GamePlay