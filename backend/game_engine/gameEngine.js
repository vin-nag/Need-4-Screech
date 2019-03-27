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

        // last input
        this.lastInput = {event: "initialized"} ;
        this.lastInput[config.controls.up] = false;
        this.lastInput[config.controls.down] = false;
        this.lastInput[config.controls.left] = false;
        this.lastInput[config.controls.right] = false;
        this.lastInput[config.controls.shoot] = false;
        this.lastInput[config.controls.new]= false;
        this.lastInput[config.controls.mouseclick] = false;
        this.lastInput[config.controls.bounding] = false;
        this.lastInput[config.controls.ray] = false;
    }

    loadSerializedEntities(entities){
        this.entity_manager = new EntityManager()
        this.entity_manager.loadSerializedEntities(entities);
    }


    init(){
        this.entity_manager.addModel.background_img_george();
        this.entity_manager.addModel.player(390,435);
        this.entity_manager.addModel.enemy_snake(700, 415);

        this.entity_manager.addModel.decorator_lantern(800, 500);
        this.entity_manager.addModel.decorator_pole_1(50, 325);
        this.entity_manager.addModel.decorator_pole_2(625, 320);
        this.entity_manager.addModel.decorator_pole_3(1050, 320);
        this.entity_manager.addModel.decorator_van(-60, 320);
        this.entity_manager.addModel.level_end_taxi(2270, 500);

        //this.entity_manager.addModel.game_bar(0,0);
        this.entity_manager.addModel.bar_timer();
        this.entity_manager.addModel.bar_health();
        this.entity_manager.addModel.bar_screech();

        this.entity_manager.addModel.tile_grey_left(0, 625);
        for (let x = 64; x < 2560; x+=64){
            this.entity_manager.addModel.tile_grey_center(x, 625);
        }
        // this.entity_manager.addModel.tile_grey_right(2560, 625);
        // this.entity_manager.addModel.tile_grey_left(192, 561);
        // this.entity_manager.addModel.tile_grey_right(256, 561);
        // this.entity_manager.addModel.tile_grey_left(320, 495);
        // this.entity_manager.addModel.tile_grey_right(384, 495);

        this.entity_manager.addModel.powerup_shield(400,590);
        this.entity_manager.addModel.powerup_invincible(600, 590);
        this.entity_manager.addModel.powerup_speed(800, 590);
        this.entity_manager.addModel.powerup_health(1200, 590);

        for (let x = 1000; x < 2500; x+=300){
            this.entity_manager.addModel.checkpoints(x, 475);
        }
        
        this.entity_manager.addModel.score();
        this.entity_manager.addModel.screech_remaining(15);
        this.entity_manager.addModel.deliveries_left(5);
        
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
        let velocity = new Vector(12 + playerTransform.velocity.x, 0);
        if (playerTransform.scale === -1) {
            velocity = new Vector(-12 + playerTransform.velocity.x, 0);
        }

        bullet.addComponent(components.CTransform(bulletPosition, bulletPrevious, 1, velocity, 0));
        bullet.addComponent(components.CBoundingBox(size, half_size));
        bullet.addComponent(components.CAnimation('buster', 1, 0, 0));
        bullet.addComponent(components.CState('shooting'));
        bullet.addComponent(components.CLifeSpan(1000))
    }

    spawnScreech() {
        /*
        This function spawns a screech bottle, which if collide with checkpoint
        * screech delivered += 1, else it will smash on ground and catch on fire
         */
        let screech = this.entity_manager.addEntity("screech");
        let player = this.entity_manager.getEntitiesByTag("player")[0];
        let playerTransform = player.getComponent('CTransform');
        let bulletPosition = new Vector(playerTransform.position.x, playerTransform.position.y + 15);
        let bulletPrevious = new Vector(playerTransform.position.x, playerTransform.position.y);
        let size = new Vector(48, 16);
        let half_size = new Vector(24, 8);
        let velocity = new Vector(12 + playerTransform.velocity.x, 0);
        if (playerTransform.scale === -1) {
            velocity = new Vector(-12 + playerTransform.velocity.x, 0);
        }

        screech.addComponent(components.CTransform(bulletPosition, bulletPrevious, 1, velocity, 0));
        screech.addComponent(components.CBoundingBox(size, half_size));
        screech.addComponent(components.CAnimation('screech', 1, 0, 0));
        screech.addComponent(components.CState('shooting'));
        // has no CLifespan component, as the bottle will has an arc when thrown and
        // either collide with checkpoint or hit ground
    }

    spawnFire(e) {
        let fire = this.entity_manager.addEntity("fire");
        let size = new Vector(50, 50);
        let half_size = new Vector(25, 25);
        let position = e.getComponent('CTransform').position;
        let previous_position = e.getComponent('CTransform').previous_position;
        let velocity = new Vector(0,0)
        fire.addComponent(components.CTransform(position, previous_position, 1, velocity, 0));
        fire.addComponent(components.CBoundingBox(size, half_size));
        fire.addComponent(components.CAnimation('fire_small', 24, 0, .7));
        fire.addComponent(components.CLifeSpan(2000))
    }

    spawnBoom(e) {
        let boom = this.entity_manager.addEntity("boom");
        let size = new Vector(50, 50);
        let half_size = new Vector(25, 25);
        let position = e.getComponent('CTransform').position;
        let boomPos = new Vector(position.x, position.y - 50)
        let previous_position = e.getComponent('CTransform').previous_position;
        let velocity = new Vector(0,0)
        boom.addComponent(components.CTransform(boomPos, previous_position, 1, velocity, 0));
        boom.addComponent(components.CBoundingBox(size, half_size));
        boom.addComponent(components.CAnimation('boom', 13, 0, .8));
        boom.addComponent(components.CLifeSpan(2000))

    }

    spawnCheckpointSuccess(checkpoint) {
        let checkpointTransform = checkpoint.getComponent('CTransform');
        let position = checkpointTransform.position;
        let prevPos = checkpointTransform.prevPos;
        let velocity = checkpointTransform.velocity;
        const checkpoint_success = this.entity_manager.addEntity("checkpoint_success");
        checkpoint_success.addComponent(components.CTransform(position, prevPos, 1, velocity, 0));
        checkpoint_success.addComponent(components.CAnimation('checkpoint_success', 1, 0, 0));
        checkpoint_success.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
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
            this.sGameState();
            this.entity_manager.update();
        }
    }

    sBars(){
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        for (let entity of this.entity_manager.getEntitiesByTag("bar")){
            let values = entity.getComponent("CBar");
            let state = entity.getComponent("CState").state;
            let player_powerup = player.getComponent("CPowerup");
            let game_running = player.getComponent("CGameRunning");

            switch (state){
                case "timer":
                    if (game_running.running) {
                        values.value--;
                    }
                    if (values.value === 0) {
                        game_running.running = false;
                        values.value = 0;
                    }
                    break;

                case "health":
                    if (game_running.running) {
                        values.value = player.getComponent("CHealth").health;
                        if (values.value === 0) {
                            game_running.running = false;
                        }
                    }
                    break;

                case "drunk":
                    if (player_powerup.drunk) {
                        values.value--;
                    }
                    if (values.value === 0) {
                        player_powerup.drunk = false;
                        values.value = 0
                    }
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
        CInput.interact = this.lastInput[config.controls.interact];
        CInput.screech = this.lastInput[config.controls.screech];
        CInput.drink = this.lastInput[config.controls.drink];



        if (CInput.shoot) {
            if (CInput.canShoot) {
                this.spawnBullet();
                CInput.canShoot = false
                setTimeout(() => CInput.canShoot = true, 400)
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

        //Level Editor Input

        if (this.lastInput[config.controls.new] === true){
            //console.log("Input N TILE IS SPAWNED!!!!!!");

            let tile = this.entity_manager.addEntity("tile");

            // animation
            tile.addComponent(components.CAnimation('GreyTile',1,0,0))

            // transform
            let position = new Vector(250,125);
            let previous_position = new Vector(250, 125);
            let velocity = new Vector(0, 0);
            tile.addComponent(components.CTransform(position, previous_position,1, velocity,0));

            //bounding box
            let size = new Vector(64, 64);
            let half_size = new Vector(32, 32);
            tile.addComponent(components.CBoundingBox(size, half_size));
        }


        //Not working currently
        if (this.lastInput[config.controls.mouseclick] === true){
            console.log("Mouse Clicked")



        }

        if (CInput.interact){
            // open door logic
            console.log("E pressed")
        }

        if (CInput.screech){
            // throw screech
            let game_running = player.getComponent("CGameRunning");
            console.log("O pressed")
            if (game_running.running) {
                if (CInput.canScreech) {
                    const screech_remaining = this.entity_manager.getEntitiesByTag("screech_remaining")[0];
                    const deliveries_left = this.entity_manager.getEntitiesByTag("deliveries_left")[0];
                    let screech_count = screech_remaining.getComponent('CScreech').screechCount;
                    let deliveries = deliveries_left.getComponent('CScore').score;
                    this.spawnScreech();
                    screech_remaining.getComponent('CScreech').screechCount -= 1;
                    CInput.canScreech = false
                    if (screech_count === 0 && deliveries > 0) {
                        game_running.running = false;
                        screech_remaining.getComponent('CScreech').screechCount = 0;
                    }
                    setTimeout(() => CInput.canScreech = true, 400)
                }
            }

        }

        if (CInput.drink){
            // drink screech
            const screech_remaining = this.entity_manager.getEntitiesByTag("screech_remaining")[0];
            console.log("F pressed")
            if (CInput.canDrink) {
                let player_powerup = player.getComponent('CPowerup');
                player_powerup.drunk = true
                screech_remaining.getComponent('CScreech').screechCount -= 1;
                CInput.canDrink = false;
                for (let entity of this.entity_manager.getEntitiesByTag("bar")) {
                    if (entity.getComponent('CState').state === "drunk") {
                        entity.getComponent('CBar').value = entity.getComponent('CBar').maxValue;
                    }
                }
                setTimeout(() => CInput.canDrink = true, 500)
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
        let game_running = player.getComponent('CGameRunning');

        if (game_running.running) {

            if (playerInput.up) {
                if (playerPowerup.drunk) {
                    if (playerState.state === "grounded" || playerState.state === "running") {
                        newState = "jumping";
                        playerTransform.velocity.y = config.player.drunk_jump;
                    }
                }
                else {
                    if (playerState.state === "grounded" || playerState.state === "running") {
                        newState = "jumping";
                        playerTransform.velocity.y = config.player.jump;
                    }
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
            for (let entity of this.entity_manager.getEntities()) {
                if (entity.tag === "bg-img"){continue}
                let eTransform = entity.getComponent('CTransform');

                    // add gravity effects to every entity that has CGravity
                    if (entity.hasComponent('CGravity')) {
                        if (player.getComponent('CPowerup').drunk) {
                            //let eGravity = entity.getComponent('CGravity');
                            eTransform.velocity.y += config.game_engine.drunk_gravity;
                        }
                        else {
                            let eGravity = entity.getComponent('CGravity');
                            eTransform.velocity.y += eGravity.gravity;
                        }

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
            let game_running = player.getComponent("CGameRunning");

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
                        console.log('player dead');
                        
                    }
                }
            }
        }

        // bullet / enemy collision
        for (let enemy of this.entity_manager.getEntitiesByTag("enemy")) {
            for (let bullet of this.entity_manager.getEntitiesByTag("bullet")) {
                const score = this.entity_manager.getEntitiesByTag("score")[0];
                let overlap = physics.getOverLap(enemy, bullet);
                if (overlap.x > 0 && overlap.y > 0){
                    score.getComponent('CScore').score += 10;
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
                    console.log("speed")
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

                if (powerup.getComponent('CAnimation').animName === 'health_pack') {
                    // health
                    console.log("shield")
                    if (player.getComponent('CHealth').health < 100) {
                        player.getComponent('CHealth').health += 20;
                    }
                    powerup.destroy();
                }
            }
        }

        // screech / checkpoint collision 
        for (let bottle of this.entity_manager.getEntitiesByTag("screech")) {
            for (let checkpoint of this.entity_manager.getEntitiesByTag("checkpoint")) {
                const score = this.entity_manager.getEntitiesByTag("score")[0];
                const deliveries_left = this.entity_manager.getEntitiesByTag("deliveries_left")[0];
                let overlap = physics.getOverLap(bottle, checkpoint);
                if (overlap.x > 0 && overlap.y > 0) {
                    this.spawnCheckpointSuccess(checkpoint)
                    bottle.destroy();
                    checkpoint.destroy();
                    score.getComponent('CScore').score += 100;
                    deliveries_left.getComponent('CScore').score -= 1;
                    console.log("screech delivered");
                }
            }
        }

        // screech / enemy collision
        for (let bottle of this.entity_manager.getEntitiesByTag("screech")) {
            for (let enemy of this.entity_manager.getEntitiesByTag("enemy")) {
                const score = this.entity_manager.getEntitiesByTag("score")[0];
                let overlap = physics.getOverLap(bottle, enemy);
                if (overlap.x > 0 && overlap.y > 0) {
                    score.getComponent('CScore').score += 35;
                    this.spawnBoom(bottle);
                    bottle.destroy();
                    enemy.destroy();
                }
            }
        }

        // screech / tile collision
        for (let bottle of this.entity_manager.getEntitiesByTag("screech")) {
            for (let tile of this.entity_manager.getEntitiesByTag("tile")) {
                let overlap = physics.getOverLap(bottle, tile);
                if (overlap.x > 0 && overlap.y > 0) {
                    this.spawnFire(bottle)
                    bottle.destroy();
                }
            }
        }

        // player / taxi collision 
        for (let taxi of this.entity_manager.getEntitiesByTag("taxi")) {
            let overlap = physics.getOverLap(player, taxi);
            if (overlap.x > 0 && overlap.y > 0) {
                // level end, check if player delivered all screech
                // if so, go to next level, if not, show level failed screen.
                this.sLevelEnd();
                
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

                if (entity.tag === "boom") {
                    if (animation.currentFrame >= 12) {
                        entity.destroy();
                    }
                }
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

        // fire lifespan
        for (let fire of this.entity_manager.getEntitiesByTag("fire")) {
            setTimeout(() => fire.destroy(), fire.getComponent('CLifeSpan').lifespan)
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

    // check if player completed level successfully
    sLevelEnd() {
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        const deliveries_left = this.entity_manager.getEntitiesByTag("deliveries_left")[0];
        const score = this.entity_manager.getEntitiesByTag("score")[0];
        const screech_remaining = this.entity_manager.getEntitiesByTag("screech_remaining")[0];

        let deliveries = deliveries_left.getComponent('CScore').score;
        let level_score = score.getComponent('CScore').score; // will use this later to write score to db after each level
        let screech = screech_remaining.getComponent('CScreech').screechCount;
        let game_running = player.getComponent("CGameRunning");

        if (deliveries > 0) {
            console.log("You missed one or more deliveries, game over!")
            game_running.running = false;
            // show level restart screen
        }

        if (screech === 0 && deliveries > 0) {
            console.log("You ran out of screech, game over!");
            game_running.running = false;
            // show level restart screen
        }
        if (deliveries === 0){
            console.log("level complete");
            // segue player back to overworld with next level unlocked
            // store level score in player collection in database
        }

    }

    // check if game running is false, if so stop game
    sGameState() {
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        let game_running = player.getComponent("CGameRunning").running;

        if (!game_running) {
            console.log("level failed");
            // show level restart screen
        }
    }

    returnGameState(){
        return this.entity_manager.getEntities();
    }

}

module.exports = new GameEngine;
