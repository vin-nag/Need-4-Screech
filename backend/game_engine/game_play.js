// imports
const components = require("./components");
const entity_manager_file = require("./entity_manager");
const entity_manager = new entity_manager_file();
const config = require("./../../config-template.json");
const vector_file = require("./vector");


const player = entity_manager.addEntity( "player");

function spawnPlayer() {
    // this function spawns a player

    player.addComponent(components.CLifeSpan(5));
    player.addComponent(components.CGravity(-9.8));
    player.addComponent(components.CHealth(100));

    // CInput
    up = false;
    down = false;
    left = false;
    right = false;
    canShoot = false;
    player.addComponent(components.CInput(up, down, left, right, canShoot));

    // CTransform
    let position = new vector_file(0,0);
    let previous_position = new vector_file(0,0);
    let velocity = new vector_file(0,0);
    player.addComponent(components.CTransform(position,previous_position,1,velocity,0));
}

function play() {
    // this function
    console.log('entitities', entity_manager.entities);

    spawnPlayer();
    entity_manager.update();
    //console.log('player spawned. player object:', player);
    console.log('entitities: ', entity_manager.entities);

    player.destroy();
    //console.log(player.active);
    entity_manager.update();
    console.log('entities:', entity_manager.entities);
}

function update(){
    entity_manager.update();
    //getUserInput();
    //emitGameState();
}

function sMovement(){

    let playerInput = player.CInput;
    let playerTransform = player.CTransform;

    if (playerInput.up) {
        playerTransform.velocity.y = config.player.jump;
    }

    if (playerInput.left) {
        playerTransform.velocity.x = - config.player.speed;
        //playerTransform.scale.x = -1
    }

    if (playerInput.right) {
        playerTransform.velocity.x = config.player.speed;
        //playerTransform.scale.x = 1
    }

    if (playerInput.left && playerInput.right) {
        playerTransform.velocity.x = 0;
        //playerTransform.scale.x = 1
    }
}


play();

module.exports = {player};
