// imports
const components = require("./components");
const entity_models = require("./default_entity_models");
const EntityManager = require("./entity_manager");
const config = require("./../../config-template.json");
const Vector = require("./vector");
const physics = require("./physics");

class GameEngine {

    constructor(sessionId){
        this.sessionId = sessionId;
        this.entity_manager = new EntityManager();
        this.gameStarted = false;
        this.selectedEntity = null
        this.mousePositiion = new Vector(0,0)

        // last input
        this.lastInput = {event: "initialized"} ;
        this.lastInput[config.controls.up] = false;
        this.lastInput[config.controls.down] = false;
        this.lastInput[config.controls.left] = false;
        this.lastInput[config.controls.right] = false;
        this.lastInput[config.controls.shoot] = false;
        this.lastInput[config.controls.bounding] = false;
        this.lastInput[config.controls.ray] = false;
    }

    loadSerializedEntities(entities){
        this.entity_manager = new EntityManager()
        this.entity_manager.loadSerializedEntities(entities);
    }


    init(){
        this.entity_manager.addModel.background_img_george();
        this.entity_manager.addModel.player(100,435);
        this.entity_manager.addModel.enemy_snake(700, 415);

        this.entity_manager.addModel.decorator_lantern(800, 500);
        this.entity_manager.addModel.decorator_pole_1(50, 325);
        this.entity_manager.addModel.decorator_pole_2(625, 320);
        this.entity_manager.addModel.decorator_pole_3(1050, 320);

        this.entity_manager.addModel.bar_timer();
        this.entity_manager.addModel.bar_health();
        this.entity_manager.addModel.bar_screech();

        this.entity_manager.addModel.tile_grey_left(0, 625);
        for (let x = 64; x < 2560; x+=64){
            this.entity_manager.addModel.tile_grey_center(x, 625);
        }
        this.entity_manager.addModel.tile_grey_right(2560, 625);
        this.entity_manager.addModel.tile_grey_left(192, 561);
        this.entity_manager.addModel.tile_grey_right(256, 561);
        this.entity_manager.addModel.tile_grey_left(320, 495);
        this.entity_manager.addModel.tile_grey_right(384, 495);

        this.entity_manager.addModel.powerup_shield(400,590);
        this.entity_manager.addModel.powerup_invincible(600, 590);
        this.entity_manager.addModel.powerup_speed(800, 590);
    }

    startGame() {
        // this function starts the game, spawning the player and other necessary things
        console.log('starting game');
        this.init();
        console.log('game started');
    }

    spawnBullet() {
        /*
        This function spawns a bullet, adding all the necessary components
         */
        let bullet = this.entity_manager.addEntity("bullet");
        let player = this.entity_manager.getEntitiesByTag("player")[0];
        let playerTransform = player.getComponent('CTransform');
        let bulletPosition = new Vector(playerTransform.position.x, playerTransform.position.y + 15);
        let bulletPrevious = new Vector(playerTransform.position.x, playerTransform.position.y);
        let size = new Vector(48, 16);
        let half_size = new Vector(24, 8);
        let velocity = new Vector(12, 0);
        if (playerTransform.scale === -1) {
            velocity = new Vector(-12, 0);
        }

        bullet.addComponent(components.CTransform(bulletPosition, bulletPrevious, 1, velocity, 0));
        bullet.addComponent(components.CBoundingBox(size, half_size));
        bullet.addComponent(components.CAnimation('screech', 1, 0, 0));
        bullet.addComponent(components.CState('shooting'));
        bullet.addComponent(components.CLifeSpan(1000))
    }


    update(){
        // this function handles the update function, starting a game if it hasn't been already
        if (!this.gameStarted){
            this.startGame();
            this.entity_manager.update();
            this.gameStarted = true;
        }
        else {
            // console.log('game continuing', this.entity_manager.getEntities());
            this.sInput();
            this.sMovement();
            this.sCollision();
            this.sAnimation();
            this.sLifespan();
            this.sBars();
            this.sEnemyRayCasting();
            this.entity_manager.update();
        }
    }

    sBars(){
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        for (let entity of this.entity_manager.getEntitiesByTag("bar")){
            let values = entity.getComponent("CBar");
            let state = entity.getComponent("CState").state;

            switch (state){
                case "timer":
                    values.value--;
                    break;

                case "health":
                    values.value = player.getComponent("CHealth").health;
                    break;

                case "drunk":
                    values.value = player.getComponent("CHealth").health;
                    break;
            }
        }
    }

    sInput(){
        // Input system
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        let CInput = player.getComponent('CInput');

        CInput.up = this.lastInput[config.controls.up];
        CInput.down = this.lastInput[config.controls.down];
        CInput.left = this.lastInput[config.controls.left];
        CInput.right = this.lastInput[config.controls.right];
        CInput.shoot = this.lastInput[config.controls.shoot];
        CInput.bounding = this.lastInput[config.controls.bounding];
        CInput.ray = this.lastInput[config.controls.ray];

        if (CInput.shoot) {
            if (CInput.canShoot) {
                this.spawnBullet();
                CInput.canShoot = false
                setTimeout(() => CInput.canShoot = true, 200)
            }
        }

        if (CInput.bounding){
            for (let entity of this.entity_manager.getEntities()){
                if (entity.hasComponent('CBoundingBox')){
                    entity.getComponent('CBoundingBox').show = !entity.getComponent('CBoundingBox').show;
                }
            }
        }

        if (CInput.ray){
            for (let entity of this.entity_manager.getEntitiesByTag("enemy")){
                entity.getComponent("CEnemyAI").show = !entity.getComponent("CEnemyAI").show;
            }
        }
    }

    sMovement() {

        // movement system
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        let playerInput = player.getComponent('CInput');
        let playerTransform = player.getComponent('CTransform');
        let playerState = player.getComponent('CState');
        let newState = playerState.state;
        let playerPowerup = player.getComponent('CPowerup');

        if (playerInput.up) {
            if (playerState.state === "grounded" || playerState.state === "running") {
                newState = "jumping";
                playerTransform.velocity.y = config.player.jump;
            }
        }

        if (playerInput.left) {
            if (playerPowerup.superSpeed) {
                playerTransform.velocity.x = -config.player.speed - 10;
                playerTransform.scale = -1;
                newState = "running"
            }
            else {
                playerTransform.velocity.x = -config.player.speed;
                playerTransform.scale = -1;
                newState = "running"
            }

        }

        if (playerInput.right) {
            if (playerPowerup.superSpeed) {
                playerTransform.velocity.x = config.player.speed + 10;
                playerTransform.scale = 1;
                newState = "running"
            }
            else {
                playerTransform.velocity.x = config.player.speed;
                playerTransform.scale = 1;
                newState = "running"
            }
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

        // stop player from walking left off level
        if (playerTransform.position.x < 0) {
            playerTransform.position = playerTransform.previous_position;
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
            if (entity.tag === "bg-img"){continue}
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

        const player = this.entity_manager.getEntitiesByTag("player")[0];
        let playerTransform = player.getComponent('CTransform');

        for (let tile of this.entity_manager.getEntitiesByTag("tile")){

            if (!tile.hasComponent("CBoundingBox")) {continue;}

            let tileTransform = tile.getComponent("CTransform");
            let overlap = physics.getOverLap(player, tile);

            if (overlap.x > 0 && overlap.y > 0) {

                let prevOverlap = physics.getPrevOverLap(player, tile);

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

            let overlap = physics.getOverLap(enemy, player);
            let playerHealth = player.getComponent('CHealth');
            let playerPowerup = player.getComponent('CPowerup');

            if (overlap.x > 0 && overlap.y > 0){
                if (playerPowerup.invincibility) {
                    return;
                }
                else {
                    if (playerPowerup.shield) {
                        playerPowerup.shield = false;
                        playerHealth.invincible = true;
                        setTimeout(() => playerHealth.invincible = false, 800)
                        return;
                    }
                    if (!playerHealth.invincible) {
                        playerHealth.invincible = true;
                        playerHealth.health -= 20;
                        // Invincibility frames
                        setTimeout(() => playerHealth.invincible = false, 800)
                    }
                    if (playerHealth.health === 0) {
                        player.destroy();
                        //console.log('player dead');
                    }
                }
            }
        }

        // bullet / enemy collision
        for (let enemy of this.entity_manager.getEntitiesByTag("enemy")) {
            for (let bullet of this.entity_manager.getEntitiesByTag("bullet")) {
                let overlap = physics.getOverLap(enemy, bullet);
                if (overlap.x > 0 && overlap.y > 0){
                    bullet.destroy();
                    enemy.getComponent('CHealth').show = true;
                    enemy.getComponent('CHealth').health--;

                    setTimeout(() => { enemy.getComponent('CHealth').show = false; }, 2000);

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

        // player / powerup collision
        for (let powerup of this.entity_manager.getEntitiesByTag("powerup")) {
            let overlap = physics.getOverLap(player, powerup);
            if (overlap.x > 0 && overlap.y > 0){
                if (powerup.getComponent('CAnimation').animName === 'SuperSpeed') {
                    //speed
                    console.log("shield")
                    player.getComponent('CPowerup').superSpeed = true;
                    powerup.destroy();
                    setTimeout(() => player.getComponent('CPowerup').superSpeed = false, 10000)
                }
                if (powerup.getComponent('CAnimation').animName === 'Invincibility') {
                    // temporary invincibility
                    console.log("inv")
                    player.getComponent('CPowerup').invincibility = true;
                    powerup.destroy();
                    setTimeout(() => player.getComponent('CPowerup').invincibility = false, 10000)
                }
                if (powerup.getComponent('CAnimation').animName === 'Shield') {
                    // shield
                    console.log("shield")
                    player.getComponent('CPowerup').shield = true;
                    powerup.destroy();
                }
            }
        }

        //update CState
        let state = player.getComponent("CState");
        let newState = state.state;
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

    sEnemyRayCasting(){
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        const playerTransform = player.getComponent("CTransform");
        const playerBounding = player.getComponent('CBoundingBox');
        const playerOffSet = playerTransform.position.add(playerBounding.halfSize);

        for (let enemy of this.entity_manager.getEntitiesByTag("enemy")){
            let playerDetected = false;
            let enemyTransform = enemy.getComponent('CTransform');
            let enemyBounding = enemy.getComponent('CBoundingBox');
            let enemyOffSet = enemyTransform.position.add(enemyBounding.halfSize);
            let enemyAI = enemy.getComponent('CEnemyAI');
            let distance_to_player = (playerOffSet.subtract(enemyOffSet)).abs();

            // ignore if player is farther than range of enemy
            if (distance_to_player.length() > enemyAI.detection_distance){continue}

            for (let tile of this.entity_manager.getEntitiesByTag("tile")){
                let tileTransform = tile.getComponent("CTransform");
                let tileBounding = tile.getComponent("CBoundingBox");
                let tileOffSet = tileTransform.position.add(tileBounding.halfSize);
                let distance_to_tile = (tileOffSet.subtract(enemyOffSet)).abs();

                // ignore if tile is farther than range of enemy
                if (distance_to_tile.length() > enemyAI.detection_distance){continue}

                let points = physics.getPointsBetweenVectors(enemyOffSet, tileOffSet);

                for (let point of points){
                    if (physics.pointIntersectingPolygon(point, tileTransform.position, tileBounding.size)){
                        break;
                    }
                    if (physics.pointIntersectingPolygon(point, playerTransform.position, playerBounding.size)){
                        playerDetected = true;
                        break;
                    }
                }

                if (playerDetected){
                    //console.log('player detected');
                    break;
                }
            }
            enemyAI.playerPosition = playerOffSet;
            enemyAI.player_detected = playerDetected;
            enemyAI.show = playerDetected;
        }
    }

    sLifespan() {
        // bullet lifespan
        for (let bullet of this.entity_manager.getEntitiesByTag("bullet")) {
            setTimeout(() => bullet.destroy(), bullet.getComponent('CLifeSpan').lifespan)
        }
    }

    updatePlayerAnimation(){
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        let state = player.getComponent("CState").state;
        let animation = player.getComponent("CAnimation");

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
        }
    }

    sEditor(){
        // Updating entity position according to mouse position
        let entity = this.selectedEntity
        let eTransform = entity.getComponent('CTransform')
        eTransform.position.x = this.mousePositiion.x
        eTransform.position.y = this.mousePositiion.y
    }

    setSelectedEntity(entity){
        this.selectedEntity = entity
    }

    setMousePosition(x, y){
        this.mousePositiion.x = x
        this.mousePositiion.y = y
    }

    returnGameState(){
        return this.entity_manager.getEntities();
    }

}

module.exports = new GameEngine;
