// imports
const components = require("./components");
const EntityManager = require("./entity_manager");
const config = require("./../../config-template.json");
const Vector = require("./vector");

class GameEngine {

    constructor(sessionId){
        this.sessionId = sessionId;
        this.entity_manager = new EntityManager();
        this.player = this.entity_manager.addEntity( "player");
        this.gameStarted = false;
    }

     spawnPlayer() {
        /*
        This function spawns a player, adding all the necessary components
         */
        console.log('spawning player now');
        this.player.addComponent(components.CLifeSpan(config.player.lifeSpan));
        this.player.addComponent(components.CGravity(config.game_engine.gravity));
        this.player.addComponent(components.CHealth(config.player.health));

        // CInput
        let up = false;
        let down = false;
        let left = false;
        let right = false;
        let canShoot = false;
        this.player.addComponent(components.CInput(up, down, left, right, canShoot));

        // CTransform
        let position = new Vector(100, 100);
        let previous_position = new Vector(0, 0);
        let velocity = new Vector(0, 0);
        this.player.addComponent(components.CTransform(position, previous_position,1, velocity,0));
        console.log('player spawned. player object:', this.player);

        this.player.addComponent(components.CAnimation('stand64',1,0,0))
    }

     startGame() {
        // this function starts the game, spawning the player and other necessary things

        console.log('starting game');
        this.spawnPlayer();
        this.entity_manager.update();
        console.log('game started');
    }

    update(){
        // this function handles the update function, starting a game if it hasn't been already
        if (!this.gameStarted){
            this.startGame();
            this.gameStarted = true;
        }
        else {
            console.log('game continuing');
            this.sMovement();
            this.entity_manager.update();
        }
    }

    sMovement(){
        // movement system

        let playerInput = this.player.getComponent('CInput');
        let playerTransform = this.player.getComponent('CTransform');

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

    returnGameState(){
        /*
        this function returns the game state as an object
         */
        return {
            'player': this.entity_manager.getEntitiesByTag('player')[0],
            'enemies': this.entity_manager.getEntitiesByTag('enemy'),
            'tiles': this.entity_manager.getEntitiesByTag('tile'),
            'bullets': this.entity_manager.getEntitiesByTag('bullet')
        };
    }






}

module.exports = new GameEngine;
