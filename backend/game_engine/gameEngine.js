// imports
const components = require("./components");
const EntityManager = require("./entity_manager");
const config = require("./../../config-template.json");
const Vector = require("./vector");
const physics = require("./physics");

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
        let position = new Vector(100, 435);
        let previous_position = new Vector(0, 0);
        let velocity = new Vector(0, 0);
        this.player.addComponent(components.CTransform(position, previous_position,1, velocity,0));
        console.log('player spawned. player object:', this.player);

        //CBoundingBox
         let size = new Vector(64, 64);
         let half_size = new Vector(32, 32);
         this.player.addComponent(components.CBoundingBox(size, half_size));
     }

    spawnTiles() {

        for (let x = 0; x < 1280; x+=64){
            let tile = this.entity_manager.addEntity("tile");

            // animation
            tile.addComponent(components.CAnimation('GreyTile',1,0,0))

            // transform
            let position = new Vector(x, 500);
            let previous_position = new Vector(x, 500);
            let velocity = new Vector(0, 0);
            tile.addComponent(components.CTransform(position, previous_position,1, velocity,0));

            //bounding box
            let size = new Vector(64, 64);
            let half_size = new Vector(32, 32);
            tile.addComponent(components.CBoundingBox(size, half_size));
        }

        //extra tile to jump to

        let tile = this.entity_manager.addEntity("tile");

        // animation
        tile.addComponent(components.CAnimation('GreyTile',1,0,0))

        // transform
        let position = new Vector(200, 375);
        let previous_position = new Vector(200, 375);
        let velocity = new Vector(0, 0);
        tile.addComponent(components.CTransform(position, previous_position,1, velocity,0));

        //bounding box
        let size = new Vector(64, 64);
        let half_size = new Vector(32, 32);
        tile.addComponent(components.CBoundingBox(size, half_size));

    }

     startGame() {
        // this function starts the game, spawning the player and other necessary things

        console.log('starting game');
        this.spawnPlayer();
        this.spawnTiles();
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
            this.sCollision();
            this.entity_manager.update();
        }
    }


    sInput(){
        // Input system
        let CInput = this.player.getComponent('CInput');
        if (this.lastInput.event === "onKeyDown"){
            if (this.lastInput.key === config.controls.up) {
                CInput.up = true;
                //console.log("W Pressed")
            }
            if (this.lastInput.key === config.controls.left) {
                CInput.left = true;
                //console.log("A Pressed")
            }
            if (this.lastInput.key === config.controls.down) {
                CInput.down = true;
                //console.log("S Pressed")
            }
            if (this.lastInput.key === config.controls.right) {
                CInput.right = true;
                //console.log("D Pressed")
            }
            if (this.lastInput.key === config.controls.shoot) {
                CInput.shoot = true;
                //console.log("Space Pressed")
            }
        }

        if (this.lastInput.event === "onKeyUp"){
            if (this.lastInput.key === config.controls.up) {
                CInput.up = false;
                //console.log("W Released")
            }
            if (this.lastInput.key === config.controls.left) {
                CInput.left = false;
                //console.log("A Released")
            }
            if (this.lastInput.key === config.controls.down) {
                CInput.down = false;
                //console.log("S Released")
            }
            if (this.lastInput.key === config.controls.right) {
                CInput.right = false;
                //console.log("D Released")
            }
            if (this.lastInput.key === config.controls.shoot) {
                CInput.shoot = false;
                //console.log("Space Released")
            }
        }
    }

    sMovement(){
        // movement system

        let playerInput = this.player.getComponent('CInput');
        let playerTransform = this.player.getComponent('CTransform');
        playerTransform.previous_position = playerTransform.position;

        if (playerInput.up) {
            playerTransform.velocity.y = config.player.jump;
            playerTransform.position.y += playerTransform.velocity.y;
        }

        if (playerInput.left) {
            playerTransform.velocity.x = -config.player.speed;
            playerTransform.position.x += playerTransform.velocity.x;
            //playerTransform.scale.x = -1
        }

        if (playerInput.right) {
            playerTransform.velocity.x = config.player.speed;
            playerTransform.position.x += playerTransform.velocity.x;
            //playerTransform.scale.x = 1
        }

        if (playerInput.down) {
            playerTransform.velocity.y = config.player.speed;
            playerTransform.position.y += playerTransform.velocity.y;
            //playerTransform.scale.x = 1
        }

        if (playerInput.left && playerInput.right) {
            playerTransform.velocity.x = 0;
            playerTransform.position.x = playerTransform.previous_position.x;
            //playerTransform.scale.x = 1
        }

        // add gravity effects to every entity that has CTransform
        for (let entity of this.entity_manager.getEntities()){
            if (entity.tag === 'tile'){
                continue;
            }
            if (entity.hasComponent('CTransform')){
                const eTransform = entity.getComponent('CTransform');
                eTransform.position.y += config.game_engine.gravity;
            }
        }
    }

    sCollision(){

        let playerTransform = this.player.getComponent('CTransform');
        //playerTransform.previous_position = playerTransform.position;

        // for (let tile of this.entity_manager.getEntitiesByTag("tile")){
        //     if (tile.hasComponent("CBoundingBox")){
        //         let tileTransform = tile.getComponent("CTransform")

        //     }
        // }

        for (let tile of this.entity_manager.getEntitiesByTag("tile")){
            if (tile.hasComponent("CBoundingBox")){
                let tileTransform = tile.getComponent("CTransform");
                let overlap = physics.getOverLap(this.player, tile);
                if (overlap.x > 0 && overlap.y > 0) {
                    console.log("collision");
                    let prevOverlap = physics.getPrevOverLap(this.player, tile);
                    console.log('prevoverlap', prevOverlap);
                    if (prevOverlap.y > 1){
                        console.log('collision horizontally');
                        let direction = tileTransform.position.x > playerTransform.previous_position.x ? -1 : 1;
                        playerTransform.position.x += direction * overlap.x
                    }
                    if (prevOverlap.x > 1){
                        console.log('vertical collision');
                        let direction = tileTransform.position.y > playerTransform.previous_position.y? -1: 1;
                        playerTransform.position.y += direction * overlap.y;
                        playerTransform.velocity.y = 0.0;
                    }
                    //playerTransform.position = playerTransform.previous_position;
                    //this.player.getComponent('CTransform').position = playerTransform.previous_position;
                }
            }
        }
    }

    returnGameState(){
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
