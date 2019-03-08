// imports
const components = require("./components");
const entity_manager_file = require("./entity_manager");
const entity_manager = new entity_manager_file();
const config = require("./../../config-template.json");
const Vector = require("./vector");

const player = entity_manager.addEntity( "player");

let gameStarted = false;

function spawnPlayer() {
    console.log('spawning player now');
    // this function spawns a player
    player.addComponent(components.CLifeSpan(config.player.lifeSpan));
    player.addComponent(components.CGravity(config.game_engine.gravity));
    player.addComponent(components.CHealth(config.player.health));

    // CInput
    up = false;
    down = false;
    left = false;
    right = false;
    canShoot = false;
    player.addComponent(components.CInput(up, down, left, right, canShoot));

    // CTransform
    let position = new Vector(100, 100);
    let previous_position = new Vector(0, 0);
    let velocity = new Vector(0, 0);
    player.addComponent(components.CTransform(position, previous_position,1, velocity,0));
    console.log('player spawned. player object:', player);

    player.addComponent(components.CAnimation('stand64',1,0,0))
}

function startGame() {
    // this function
    console.log('starting game');
    spawnPlayer();
    entity_manager.update();
    console.log('game started');
}

function update(){

    if (!gameStarted){
        startGame();
        gameStarted = true;
    }
    else {
        console.log('game continuing');
        sMovement();
        entity_manager.update();
    }
}

function sMovement(){

    let playerInput = player.getComponent('CInput');
    let playerTransform = player.getComponent('CTransform');

    if (playerInput.up) {
        playerTransform.velocity.y = config.player.jump;
    }

    if (playerInput.left) {
        playerTransform.velocity.x = -config.player.speed;
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

function returnGameState(){

    return {
        'player': entity_manager.getEntitiesByTag('player')[0],
        'enemies': entity_manager.getEntitiesByTag('enemy'),
        'tiles': entity_manager.getEntitiesByTag('tile'),
        'bullets': entity_manager.getEntitiesByTag('bullet')
    };
}

update();
update();
console.log('get entities by tag', entity_manager.getEntitiesByTag('player'));

module.exports = {player, update, returnGameState};

