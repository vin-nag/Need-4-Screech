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
        this.player = this.entity_manager.addEntity("player");
        this.gameStarted = false;

        // last input
        this.lastInput = {event: "initialized"} ;
        this.lastInput[config.controls.up] = false;
        this.lastInput[config.controls.down] = false;
        this.lastInput[config.controls.left] = false;
        this.lastInput[config.controls.right] = false;
        this.lastInput[config.controls.shoot] = false;
    }

    spawnPlayer() {
        /*
        This function spawns a player, adding all the necessary components
         */
        console.log('spawning player now');
        this.player.addComponent(components.CLifeSpan(config.player.lifeSpan));
        this.player.addComponent(components.CGravity(config.game_engine.gravity));
        this.player.addComponent(components.CHealth(config.player.health));
        this.player.addComponent(components.CAnimation('skeet_idle',4,0,0.25));

        // CInput
        let up = false;
        let down = false;
        let left = false;
        let right = false;
        let shoot = false;
        let canShoot = true;
        this.player.addComponent(components.CInput(up, down, left, right, shoot, canShoot));

        // CTransform
        let position = new Vector(100, 435);
        let previous_position = new Vector(100, 415);
        let velocity = new Vector(0, 0);
        this.player.addComponent(components.CTransform(position, previous_position,1, velocity,0));
        console.log('player spawned. player object:', this.player);

        //CBoundingBox
         let size = new Vector(64, 64);
         let half_size = new Vector(32, 32);
         this.player.addComponent(components.CBoundingBox(size, half_size));

         //CState
         this.player.addComponent(components.CState("grounded"));
    }

    spawnBullet() {
        /*
        This function spawns a bullet, adding all the necessary components
         */
        let bullet = this.entity_manager.addEntity("bullet")
        let playerTransform = this.player.getComponent('CTransform')
        let size = new Vector(24, 24);
        let half_size = new Vector(12, 12);
        let velocity = new Vector(12, 0);
        if (playerTransform.scale === -1) {
            velocity = new Vector(-12, 0);
        }

        bullet.addComponent(components.CTransform(playerTransform.position, playerTransform.previous_position, 1, velocity, 0));
        bullet.addComponent(components.CBoundingBox(size, half_size));
        bullet.addComponent(components.CAnimation('buster', 1, 0, 0));
        bullet.addComponent(components.CState('shooting'));
        bullet.addComponent(components.CLifeSpan(1000))

    }

    spawnEnemy() {
        /*
        This function spawns a player, adding all the necessary components
         */

        let enemy = this.entity_manager.addEntity("enemy");

        console.log('spawning enemy now');
        enemy.addComponent(components.CLifeSpan(config.player.lifeSpan));
        enemy.addComponent(components.CGravity(config.game_engine.gravity));
        enemy.addComponent(components.CHealth(2));
        enemy.addComponent(components.CAnimation('snake_walk',7,0,0.25));

        // CTransform
        let position = new Vector(700, 415);
        let previous_position = new Vector(700, 415);
        let velocity = new Vector(0, 0);
        enemy.addComponent(components.CTransform(position, previous_position,1, velocity,0));
        console.log('enemy spawned. enemy object:', enemy);

        //CBoundingBox
        let size = new Vector(64, 64);
        let half_size = new Vector(32, 32);
        enemy.addComponent(components.CBoundingBox(size, half_size));

        //CState
        enemy.addComponent(components.CState("grounded"));
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

        // extra tiles to jump to
        let x = 192;
        let y = 436;
        for (let i=0; i<5; i++){

            let tile = this.entity_manager.addEntity("tile");

            // animation
            tile.addComponent(components.CAnimation('GreyTile',1,0,0))

            // transform
            let position = new Vector(x, y);
            let previous_position = new Vector(x, y);
            let velocity = new Vector(0, 0);
            tile.addComponent(components.CTransform(position, previous_position,1, velocity,0));

            //bounding box
            let size = new Vector(64, 64);
            let half_size = new Vector(32, 32);
            tile.addComponent(components.CBoundingBox(size, half_size));
            x += 65;
            y -= 65;
        }

    }

    startGame() {
        // this function starts the game, spawning the player and other necessary things

        console.log('starting game');
        this.spawnPlayer();
        this.spawnTiles();
        this.spawnEnemy();
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
            this.sAnimation();
            this.sLifespan();
            this.entity_manager.update();
        }
    }


    sInput(){
        // Input system
        let CInput = this.player.getComponent('CInput');

        CInput.up = this.lastInput[config.controls.up];
        CInput.down = this.lastInput[config.controls.down];
        CInput.left = this.lastInput[config.controls.left];
        CInput.right = this.lastInput[config.controls.right];
        CInput.shoot = this.lastInput[config.controls.shoot];

        if (CInput.shoot) {
            if (CInput.canShoot) {
                this.spawnBullet()
                CInput.canShoot = false
                setTimeout(() => CInput.canShoot = true, 200)
            }
        }
    }

    sMovement() {
        // movement system

        let playerInput = this.player.getComponent('CInput');
        let playerTransform = this.player.getComponent('CTransform');
        let playerState = this.player.getComponent('CState');
        let newState = playerState.state;

        if (playerInput.up) {
            if (playerState.state === "grounded" || playerState.state === "running") {
                newState = "jumping";
                playerTransform.velocity.y = config.player.jump;
            }
        }

        if (playerInput.left) {
            playerTransform.velocity.x = -config.player.speed;
            playerTransform.scale = -1;
            newState = "running"
        }

        if (playerInput.right) {
            playerTransform.velocity.x = config.player.speed;
            playerTransform.scale = 1;
            newState = "running"
        }

        if (playerInput.down) {
            playerTransform.velocity.y = -config.player.jump;
            newState = "jumping";
        }

        if (playerInput.left && playerInput.right) {
            playerTransform.velocity.x = 0;
            playerTransform.scale = -1;
            newState = "grounded";
        }

        // add inertia
        if (!playerInput.left && !playerTransform.right) {

            // if slow enough, stop to 0
            if (Math.abs(playerTransform.velocity.x) < config.player.minSpeed) {
                playerTransform.velocity.x = 0;
                newState = "grounded";
            }

            if (playerTransform.velocity.x > 0) {
                playerTransform.velocity.x *= config.player.inertia;
                newState = "running"

            } else if (playerTransform.velocity.x < 0) {
                playerTransform.velocity.x *= config.player.inertia;
                newState = "running";
            }
        }

        // update all entities position based on velocity
        for (let entity of this.entity_manager.getEntities()){
            let eTransform = entity.getComponent('CTransform');

                // add gravity effects to every entity that has CGravity
                if (entity.hasComponent('CGravity')) {
                    let eGravity = entity.getComponent('CGravity');
                    eTransform.velocity.y += eGravity.gravity;
                }

            if (entity.tag === 'enemy'){
                let direction = playerTransform.position.subtract(eTransform.position);

                direction.normalize();
                direction = direction.multiply(config.player.maxspeed * 0.1);
                direction.y = eTransform.velocity.y;
                direction.x += eTransform.velocity.x / 2;
                eTransform.velocity = direction;

                    if (eTransform.velocity.x < 0) {
                        eTransform.scale = 1;
                    }
                    if (eTransform.velocity.x > 0) {
                        eTransform.scale = -1;
                    }
                }

            if (entity.tag === 'bullet') {
                eTransform.position.x += eTransform.velocity.x
            }

            eTransform.previous_position = eTransform.position;
            eTransform.position = eTransform.position.add(eTransform.velocity);
        }

            // truncate player speed if above max
            if (playerTransform.velocity.length() > config.player.maxspeed) {
                playerTransform.velocity.normalize();
                playerTransform.velocity = playerTransform.velocity.multiply(config.player.maxspeed);
            }

        if (playerState.state !== newState){
            playerState.state = newState;
            this.updatePlayerAnimation();
        }
    }

    sCollision(){

        let playerTransform = this.player.getComponent('CTransform');
        let state = this.player.getComponent("CState");
        let newState = state.state;

        for (let tile of this.entity_manager.getEntitiesByTag("tile")){

            if (!tile.hasComponent("CBoundingBox")) {continue;}

            let tileTransform = tile.getComponent("CTransform");
            let overlap = physics.getOverLap(this.player, tile);

            if (overlap.x > 0 && overlap.y > 0) {

                let prevOverlap = physics.getPrevOverLap(this.player, tile);

                if (prevOverlap.y > 0){
                    let direction = tileTransform.position.x > playerTransform.previous_position.x? -1: 1;
                    playerTransform.position.x += direction * overlap.x

                }

                else if (prevOverlap.x > 0){
                    let direction = tileTransform.position.y > playerTransform.previous_position.y? -1: 1;
                    playerTransform.position.y += direction * overlap.y;
                    playerTransform.velocity.y = 0.0;
                }
            }

            // enemy collision
            for (let enemy of this.entity_manager.getEntitiesByTag("enemy")){

                let enemyTransform = enemy.getComponent("CTransform");
                let overlap = physics.getOverLap(enemy, tile);

                if (overlap.x > 0 && overlap.y > 0) {

                    let prevOverlap = physics.getPrevOverLap(enemy, tile);

                    if (prevOverlap.y > 0){
                        let direction = tileTransform.position.x > enemyTransform.previous_position.x? -1: 1;
                        enemyTransform.position.x += direction * overlap.x
                    }

                    else if (prevOverlap.x > 0){
                        let direction = tileTransform.position.y > enemyTransform.previous_position.y? -1: 1;
                        enemyTransform.position.y += direction * overlap.y;
                        enemyTransform.velocity.y = 0.0;
                    }
                }
            }
        }

        for (let enemy of this.entity_manager.getEntitiesByTag("enemy")){

            let overlap = physics.getOverLap(enemy, this.player);
            let playerHealth = this.player.getComponent('CHealth');
            let enemyTransform = enemy.getComponent('CTransform');

            if (overlap.x > 0 && overlap.y > 0){

                let prevOverlap = physics.getPrevOverLap(enemy, this.player);

                if (prevOverlap.y > 0){
                    let direction = enemyTransform.position.x > playerTransform.previous_position.x? -1: 1;
                    playerTransform.position.x += direction * (overlap.x + 5);
                }

                else if (prevOverlap.x > 0){
                    let direction = enemyTransform.position.y > playerTransform.previous_position.y? -1: 1;
                    playerTransform.position.y += direction * overlap.y;
                }

                if (!playerHealth.invincible) {

                    state.state = "hurt";
                    this.updatePlayerAnimation();

                    playerHealth.invincible = true;
                    playerHealth.health -= 20;
                    // Invincibility frames
                    setTimeout(() => {
                        playerHealth.invincible = false;
                        state.state = "grounded";
                        this.updatePlayerAnimation();

                    }, 800)
                }
                
                if (playerHealth.health === 0) {
                    this.player.destroy();
                    //console.log('player dead');
                }
            }
        }

        // bullet / enemy collision
        for (let enemy of this.entity_manager.getEntitiesByTag("enemy")) {
            for (let bullet of this.entity_manager.getEntitiesByTag("bullet")) {
                let overlap = physics.getOverLap(enemy, bullet);
                if (overlap.x > 0 && overlap.y > 0){
                    bullet.destroy();
                    enemy.getComponent('CHealth').health--;
                    if (enemy.getComponent('CHealth').health === 0) {
                        enemy.destroy();
                        bullet.destroy();
                    }
                }
            }
        }

        // bullet / tile collision
        for (let tile of this.entity_manager.getEntitiesByTag("tile")) {
            for (let bullet of this.entity_manager.getEntitiesByTag("bullet")) {
                let overlap = physics.getOverLap(tile, bullet);
                if (overlap.x > 0 && overlap.y > 0){
                    bullet.destroy();
                }
            }
        }

        //update CState
        if (playerTransform.position.y !== playerTransform.previous_position.y){
            newState = "jumping";

        }
        else {
            newState = state.state;
        }

        if (state.state !== newState){
            state.state = newState;
            this.updatePlayerAnimation();
        }

    }

    sAnimation() {
        this.entity_manager.getEntities().forEach(entity => {
            if (entity.hasComponent('CAnimation')){
                let animation = entity.getComponent('CAnimation');
                if (animation.numOfFrames < 2) { return; }
                animation.currentFrame = (animation.currentFrame + animation.speed) % animation.numOfFrames;
            }
        })
    }

    sLifespan() {
        // bullet lifespan
        for (let bullet of this.entity_manager.getEntitiesByTag("bullet")) {
            setTimeout(() => bullet.destroy(), bullet.getComponent('CLifeSpan').lifespan)
        }
    }

    updatePlayerAnimation(){
        let state = this.player.getComponent("CState").state;
        let animation = this.player.getComponent("CAnimation");

        switch (state) {
            case "grounded":
                animation.animName = 'skeet_idle';
                animation.numOfFrames = 4;
                animation.currentFrame = 0;
                animation.speed = 0.25;
                break;

            case "jumping":
                animation.animName = 'skeet_jump';
                animation.numOfFrames = 2;
                animation.currentFrame = 0;
                animation.speed = 0.5;
                break;

            case "running":
                animation.animName = 'skeet_run';
                animation.numOfFrames = 6;
                animation.currentFrame = 0;
                animation.speed = 0.25;
                break;

            case "hurt":
                animation.animName = 'skeet_hurt';
                animation.numOfFrames = 1;
                animation.currentFrame = 0;
                animation.speed = 0;
                break;
        }
    }

    returnGameState(){
        return this.entity_manager.getEntities();
    }

}

module.exports = new GameEngine;
