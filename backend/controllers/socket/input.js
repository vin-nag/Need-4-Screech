//TODO: Delegate input => CInput mapping to the gameEngine
//TODO: Use data.gameSessionId and pass it to the GameSessionService

const gamePlayState = require("../../game_engine/gameEngine");
const player = gamePlayState.player;
const update = gamePlayState.update;
const gameState = gamePlayState.returnGameState();

const onKeyDown = (socket, data) => {

    // console log keyCode
    console.log("keydown", data.keyCode)
   
}

const onKeyUp = (socket, data) => {
   
    // console log keyCode 
    console.log("keyup", data.keyCode)
 
}

module.exports = {
    onKeyDown,
    onKeyUp
}