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
        this.gameStarted = false
        this.lastInput = 0;
    }

     spawnPlayer() {
        /*
        This function spawns a player, adding all the necessary components
         */
        console.log('spawning player now');
        this.player.addComponent(components.CLifeSpan(config.player.lifeSpan));
        this.player.addComponent(components.CGravity(config.game_engine.gravity));
        this.player.addComponent(components.CHealth(config.player.health));
        this.player.addComponent(components.CAnimation('stand64',1,0,0))

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
            // console.log('game continuing', this.entity_manager.getEntities());
            this.sInput();
            this.sMovement();
            this.entity_manager.update();
        }
    }


    sInput(){
        // Input system
        let CInput = this.player.getComponent('CInput');
        if (this.lastInput.event == "onKeyDown"){
            if (this.lastInput.key == 87) {
                CInput.up = true;
                console.log("W Pressed")
            }
            if (this.lastInput.key == 65) {
                CInput.left = true;
                console.log("A Pressed")
            }
            if (this.lastInput.key == 83) {
                CInput.down = true;
                console.log("S Pressed")
            }
            if (this.lastInput.key == 68) {
                CInput.right = true;
                console.log("D Pressed")
            }
            if (this.lastInput.key == 32) {
                CInput.shoot = true;
                console.log("Space Pressed")
            }
        }

        if (this.lastInput.event == "onKeyUp"){
            if (this.lastInput.key == 87) {
                CInput.up = false;
                console.log("W Released")
            }
            if (this.lastInput.key == 65) {
                CInput.left = false;
                console.log("A Released")
            }
            if (this.lastInput.key == 83) {
                CInput.down = false;
                console.log("S Released")
            }
            if (this.lastInput.key == 68) {
                CInput.right = false;
                console.log("D Released")
            }
            if (this.lastInput.key == 32) {
                CInput.shoot = false;
                console.log("Space Released")
            }
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
        console.log("entiries", this.entity_manager.getEntities())
        return this.entity_manager.getEntities();

        /*
        return {
            'player': this.entity_manager.getEntitiesByTag('player')[0],
            'enemies': this.entity_manager.getEntitiesByTag('enemy'),
            'tiles': this.entity_manager.getEntitiesByTag('tile'),
            'bullets': this.entity_manager.getEntitiesByTag('bullet')
        };
        this function returns the game state as an object
         */
    }

}

module.exports = new GameEngine;
