//TODO: Delegate input => CInput mapping to the gameEngine
//TODO: Use data.gameSessionId and pass it to the GameSessionService

const gamePlayState = require("../../game_engine/gameEngine");
const player = gamePlayState.player;
const update = gamePlayState.update;
const gameState = gamePlayState.returnGameState();

const onKeyDown = (socket, data) => {
    let CInput = player.getComponent('CInput');
    if (data.keyDown == 87) {
        CInput.up = true;
        console.log("W Pressed")
    }
    if (data.keyDown == 65) {
        CInput.left = true;
        console.log("A Pressed")
    }
    if (data.keyDown == 83) {
        CInput.down = true;
        console.log("S Pressed")
    }
    if (data.keyDown == 68) {
        CInput.right = true;
        console.log("D Pressed")
    }
    if (data.keyDown == 32) {
        CInput.shoot = true;
        console.log("Space Pressed")
    }
    update();
    console.log(player.getComponent("CInput"));
    
}

const onKeyUp = (socket, data) => {
    let CInput = player.getComponent('CInput');
    if (data.keyUp == 87) {
        CInput.up = false;
        console.log("W Released")
    }
    if (data.keyUp == 65) {
        CInput.left = false;
        console.log("A Released")
    }
    if (data.keyUp == 83) {
        CInput.down = false;
        console.log("S Released")
    }
    if (data.keyUp == 68) {
        CInput.right = false;
        console.log("D Released")
    }
    if (data.keyUp == 32) {
        CInput.shoot = false;
        console.log("Space Released")
    }

    update();
    console.log(player.getComponent("CInput"));
}

module.exports = {
    onKeyDown,
    onKeyUp
}