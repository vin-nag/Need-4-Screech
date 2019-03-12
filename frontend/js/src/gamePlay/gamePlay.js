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
        // stub
        if (event.type === 'keydown') {
            if(event.keyCode === 87) {
                // w pressed
                socketClient.emit('onKeyDown', {
                    keyDown: 87
                })
            }
            if(event.keyCode === 65) {
                // a pressed
                socketClient.emit('onKeyDown', {
                    keyDown: 65
                })
            }
            if(event.keyCode === 83) {
                // s pressed
                socketClient.emit('onKeyDown', {
                    keyDown: 83
                })
            }
            if(event.keyCode === 68) {
                // d pressed
                socketClient.emit('onKeyDown', {
                    keyDown: 68
                })
            }
            if(event.charCode === 32) {
                // space pressed
                socketClient.emit('onKeyDown', {
                    keyDown: 32
                })
            }
        }

        if (event.type === 'keyup') {
            if(event.keyCode === 87) {
                // w up
                socketClient.emit('onKeyUp', {
                    keyUp: 87
                })
            }
            if(event.keyCode === 65) {
                // a up
                socketClient.emit('onKeyUp', {
                    keyUp: 65
                })
            }
            if(event.keyCode === 83) {
                // s up
                socketClient.emit('onKeyUp', {
                    keyUp: 83
                })
            }
            if(event.keyCode === 68) {
                // d up
                socketClient.emit('onKeyUp', {
                    keyUp: 68
                })
            }
            if(event.keyCode === 32) {
                // space up
                socketClient.emit('onKeyUp', {
                    keyDown: 32
                })
            }
        }   
    }
}

export default GamePlay