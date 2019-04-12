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
        this.mousePosition = new Vector(0,0)

        this.editorEntityType = "tile"
        this.isEditor = false
        this.editorModelIndex = 0
        this.editorModels = this._getEditorModels()
        this.showGrid = false
        this.sfx = []

        // last input
        this.lastInput = {event: "initialized"} ;
        this.lastInput[config.controls.up] = false;
        this.lastInput[config.controls.down] = false;
        this.lastInput[config.controls.left] = false;
        this.lastInput[config.controls.right] = false;
        this.lastInput[config.controls.shoot] = false;
        this.lastInput[config.controls.new]= false;
        this.lastInput[config.controls.bounding] = false;
        this.lastInput[config.controls.ray] = false;
        this.lastInput[config.controls.delete] = false;
        this.lastInput[config.controls.lastAni]=false;
        this.lastInput[config.controls.nextAni] = false;
    }

    loadSerializedEntities(entities){
        this.entity_manager = new EntityManager()
        this.entity_manager.loadSerializedEntities(entities);
    }

     _getEditorModels() {
        const { addModel: models } = this.entity_manager
        const entityModels = [
            models.decorator_pole_1,
            models.decorator_pole_2,
            models.decorator_pole_3,
            models.decorator_lantern,
            models.decorator_van,
            models.level_end_taxi,
            models.enemy_melee_moose,
            models.enemy_ranged_chef,
            models.enemy_flying_blackbird,
            models.tile_brick,
            models.tile_grey_left,
            models.tile_grey_right,
            models.tile_grey_center,
            models.powerup_speed,
            models.powerup_invincible,
            models.powerup_shield,
            models.powerup_health,
            models.checkpoints
        ]

        return entityModels.map(model => model.bind(this.entity_manager.addModel))
    }


    init(){
        this.entity_manager.addModel.background_img_george();
        this.entity_manager.addModel.player(100,435);
        if(this.isEditor){ return } //No more entities need to be created in editor mode

        this.entity_manager.addModel.enemy_ranged_chef(1000, 550);
        this.entity_manager.addModel.enemy_flying_blackbird(1200, 100);
        this.entity_manager.addModel.enemy_flying_pinkbird(2200, 100);
        this.entity_manager.addModel.enemy_flying_pinkbird(4200, 100);
        this.entity_manager.addModel.enemy_flying_greenbird(3500, 100);
        this.entity_manager.addModel.enemy_melee_thug(1000, 500);
        this.entity_manager.addModel.enemy_melee_thug(4000, 500);

        this.entity_manager.addModel.decorator_lantern(1800, 500);
        this.entity_manager.addModel.decorator_pole_1(500, 325);
        this.entity_manager.addModel.decorator_pole_2(1325, 320);
        this.entity_manager.addModel.decorator_pole_3(2050, 320);
        this.entity_manager.addModel.decorator_van(-100, 320);
        this.entity_manager.addModel.level_end_taxi(5000, 495);

        this.entity_manager.addModel.bar_timer();
        this.entity_manager.addModel.bar_health();
        this.entity_manager.addModel.bar_screech();

        this.entity_manager.addModel.tile_grey_left(0, 625);
        for (let x = 64; x < 5120; x+=64){
            this.entity_manager.addModel.tile_grey_center(x, 625);
        }
        this.entity_manager.addModel.tile_grey_right(5120, 625);

        this.entity_manager.addModel.tile_grey_left(1000, 575);
        this.entity_manager.addModel.tile_grey_center(1064, 575);
        this.entity_manager.addModel.tile_grey_right(1128, 575);

        this.entity_manager.addModel.powerup_shield(400,552);
        this.entity_manager.addModel.powerup_invincible(600, 552);
        this.entity_manager.addModel.powerup_speed(800, 552);
        this.entity_manager.addModel.powerup_health(1200, 552);

        this.entity_manager.addModel.checkpoints(10, 475);

        for (let x = 1000; x < 2500; x+=300){
            this.entity_manager.addModel.checkpoints(x, 475);
        }

        this.entity_manager.addModel.score();
        this.entity_manager.addModel.screech_remaining(15);
        this.entity_manager.addModel.deliveries_left(5);
    }

    sealBoss(){

        this.entity_manager.addModel.background_img_ice();
        this.entity_manager.addModel.player(150,500);
        if(this.isEditor){ return } //No more entities need to be created in editor mode

        this.entity_manager.addModel.level_end_taxi(5000, 550);

        this.entity_manager.addModel.bar_timer();
        this.entity_manager.addModel.bar_health();
        this.entity_manager.addModel.bar_screech();

        this.entity_manager.addModel.score();
        this.entity_manager.addModel.screech_remaining(15);
        this.entity_manager.addModel.deliveries_left(0);

        // ground
        this.entity_manager.addModel.tile_ice_left(0, 664);
        for (let x = 64; x < 1280; x+=64){
            this.entity_manager.addModel.tile_ice_center(x, 664);
        }
        this.entity_manager.addModel.tile_ice_right(1280, 664);
        
        // Steps leading to platform
        this.entity_manager.addModel.tile_ice_left(225, 590);
        this.entity_manager.addModel.tile_ice_center(289, 590);
        this.entity_manager.addModel.tile_ice_right(353, 590);

        // High platform
        this.entity_manager.addModel.tile_ice_left(545, 290);
        for (let x = 609; x < 865; x+=64){
            this.entity_manager.addModel.tile_ice_center(x, 290);
        }
        this.entity_manager.addModel.tile_ice_right(865, 290);

        // Random steps
        this.entity_manager.addModel.tile_ice_left(929, 418);
        this.entity_manager.addModel.tile_ice_center(993, 418);
        this.entity_manager.addModel.tile_ice_right(1057, 418);

        this.entity_manager.addModel.enemy_boss_seal(700,525);

    }

    georgeStreetLevel(){
        this.entity_manager.addModel.background_img_george();
        this.entity_manager.addModel.player(150,500);
        if(this.isEditor){ return } //No more entities need to be created in editor mode

        this.entity_manager.addModel.level_end_taxi(5000, 550);

        this.entity_manager.addModel.bar_timer();
        this.entity_manager.addModel.bar_health();
        this.entity_manager.addModel.bar_screech();

        this.entity_manager.addModel.score();
        this.entity_manager.addModel.screech_remaining(15);
        this.entity_manager.addModel.deliveries_left(5);

        // ground
        this.entity_manager.addModel.tile_grey_left(0, 664);
        for (let x = 64; x < 5120; x+=64){
            this.entity_manager.addModel.tile_grey_center(x, 664);
        }
        this.entity_manager.addModel.tile_grey_right(5120, 664);

        // first fort
        this.entity_manager.addModel.tile_grey_left(300, 600);
        this.entity_manager.addModel.tile_grey_center(364, 600);
        this.entity_manager.addModel.tile_grey_center(428, 600);
        this.entity_manager.addModel.tile_grey_right(492, 600);

        this.entity_manager.addModel.tile_grey_left(364, 536);
        this.entity_manager.addModel.tile_grey_center(428, 536);
        this.entity_manager.addModel.tile_grey_right(492, 536);
        this.entity_manager.addModel.tile_grey_left(428, 472);
        this.entity_manager.addModel.tile_grey_right(492, 472);

        this.entity_manager.addModel.checkpoints(560, 514);

        this.entity_manager.addModel.tile_grey_left(1200, 600);
        this.entity_manager.addModel.tile_grey_right(1264, 600);
        this.entity_manager.addModel.tile_grey_left(1300, 525);
        this.entity_manager.addModel.tile_grey_right(1364, 525);
        this.entity_manager.addModel.tile_grey_left(1400, 450);
        this.entity_manager.addModel.tile_grey_right(1464, 450);
        this.entity_manager.addModel.tile_grey_left(1500, 375);
        this.entity_manager.addModel.tile_grey_right(1564, 375);

        this.entity_manager.addModel.tile_grey_left(1700, 250);
        this.entity_manager.addModel.tile_grey_center(1764, 250);
        this.entity_manager.addModel.tile_grey_center(1828, 250);
        this.entity_manager.addModel.tile_grey_center(1892, 250);
        this.entity_manager.addModel.tile_grey_center(1956, 250);
        this.entity_manager.addModel.tile_grey_right(2020, 250);
        this.entity_manager.addModel.checkpoints(1870, 98);

        // second fort
        this.entity_manager.addModel.tile_grey_left(2300, 600);
        this.entity_manager.addModel.tile_grey_center(2364, 600);
        this.entity_manager.addModel.tile_grey_center(2428, 600);
        this.entity_manager.addModel.tile_grey_right(2492, 600);
        this.entity_manager.addModel.tile_grey_left(2364, 536);
        this.entity_manager.addModel.tile_grey_center(2428, 536);
        this.entity_manager.addModel.tile_grey_right(2492, 536);
        this.entity_manager.addModel.tile_grey_left(2428, 472);
        this.entity_manager.addModel.tile_grey_right(2492, 472);
        this.entity_manager.addModel.tile_grey_left(2492, 408);
        for (let x = 2556; x < 3197; x+=64){
            this.entity_manager.addModel.tile_grey_center(x, 408);
        }
        this.entity_manager.addModel.tile_grey_right(3260, 408);

        this.entity_manager.addModel.checkpoints(2600, 514);

        this.entity_manager.addModel.tile_grey_left(3500, 600);
        this.entity_manager.addModel.tile_grey_center(3564, 600);
        this.entity_manager.addModel.tile_grey_center(3628, 600);
        this.entity_manager.addModel.tile_grey_center(3692, 600);
        this.entity_manager.addModel.tile_grey_right(3756, 600);
        this.entity_manager.addModel.tile_grey_left(3564, 536);
        this.entity_manager.addModel.tile_grey_center(3628, 536);
        this.entity_manager.addModel.tile_grey_right(3692, 536);
        this.entity_manager.addModel.tile_grey_center(3628, 472);

        this.entity_manager.addModel.tile_grey_left(4000, 300);
        this.entity_manager.addModel.tile_grey_right(4064, 300);

        this.entity_manager.addModel.checkpoints(4050, 150);
        this.entity_manager.addModel.checkpoints(4550, 514);

        this.entity_manager.addModel.enemy_flying_blackbird(1200, 200);
        this.entity_manager.addModel.enemy_flying_pinkbird(2200, 200);
        this.entity_manager.addModel.enemy_flying_greenbird(3500, 200);
        this.entity_manager.addModel.enemy_melee_thug(1000, 550);
        this.entity_manager.addModel.enemy_melee_thug(2000, 550);
        this.entity_manager.addModel.enemy_melee_thug(2900, 550);
        this.entity_manager.addModel.enemy_melee_thug(3400, 400);
        this.entity_manager.addModel.enemy_ranged_chef(2000, 150);
        this.entity_manager.addModel.enemy_ranged_chef(4700, 550);

        this.entity_manager.addModel.decorator_pole_1(700, 355);
        this.entity_manager.addModel.decorator_pole_2(1900, 350);
        this.entity_manager.addModel.decorator_pole_3(4000, 350);
        this.entity_manager.addModel.decorator_van(-300, 350);

        this.entity_manager.addModel.powerup_invincible(1800, 175);
        this.entity_manager.addModel.powerup_speed(800, 595);
        this.entity_manager.addModel.powerup_health(3300, 595);
        this.entity_manager.addModel.powerup_shield(1500, 595);

    }

    startGame() {
        // this function starts the game, spawning the player and other necessary things
        console.log('starting game');
        //this.init();
        this.sealBoss();
        console.log('game started');
    }


    spawnFire(e) {
        let fire = this.entity_manager.addEntity("fire");
        let size = new Vector(50, 50);
        let half_size = new Vector(25, 25);
        let position = e.getComponent('CTransform').position;
        let previous_position = e.getComponent('CTransform').previous_position;
        let velocity = new Vector(0,0)
        fire.addComponent(components.CTransform(new Vector(position.x, position.y - 20), previous_position, 1, velocity, 0));
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
        this.loadSfx("explosion")
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
        this.loadSfx("collect_key")
    }

    spawnShield() {
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        let playerTransform = player.getComponent('CTransform');
        let position = playerTransform.position;
        let previous_position = playerTransform.previous_position;
        let velocity = playerTransform.velocity;
        let shield_on = this.entity_manager.addEntity("shield_on");
        shield_on.addComponent(components.CTransform(new Vector(position.x, position.y - 20), previous_position, 1, velocity, 0));
        shield_on.addComponent(components.CAnimation('shieldOn', 6, 0, .5));
    }

    spawnInvincibility() {
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        let playerTransform = player.getComponent('CTransform');
        let position = playerTransform.position;
        let previous_position = playerTransform.previous_position;
        let velocity = playerTransform.velocity;
        let invincibility_on = this.entity_manager.addEntity("invincibility_on");
        invincibility_on.addComponent(components.CTransform(new Vector(position.x, position.y - 20), previous_position, 1, velocity, 0));
        invincibility_on.addComponent(components.CAnimation('invincibility_on', 5, 0, .5));
        setTimeout(() => invincibility_on.destroy(), 10000)
    }

    spawnPowerupTitle(powerup) {
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        let playerTransform = player.getComponent('CTransform');
        let position = playerTransform.position;
        let previous_position = playerTransform.previous_position;
        let velocity = playerTransform.velocity;
        let player_powerup = powerup.getComponent('CAnimation').animName;

        if (player_powerup === "SuperSpeed") {
            let speed_text = this.entity_manager.addEntity("speed_text");
            speed_text.addComponent(components.CTransform(new Vector(480, 200), new Vector(480, 200), 1, velocity, 0));
            speed_text.addComponent(components.CAnimation('speed++', 1, 0, 0));
            setTimeout(() => speed_text.destroy(), 1200)

        }
        else if (player_powerup === "Invincibility") {
            let invincibility_text = this.entity_manager.addEntity("invincibility_text");
            invincibility_text.addComponent(components.CTransform(new Vector(480, 200), new Vector(480, 200), 1, velocity, 0));
            invincibility_text.addComponent(components.CAnimation('inv_anim', 1, 0, 0));
            setTimeout(() => invincibility_text.destroy(), 1350)
        }
        else if (player_powerup === "Shield") {
            let shield_text = this.entity_manager.addEntity("shield_text");
            shield_text.addComponent(components.CTransform(new Vector(480, 200), new Vector(480, 200), 1, velocity, 0));
            shield_text.addComponent(components.CAnimation('plusShield', 1, 0, 0));
            setTimeout(() => shield_text.destroy(), 1350)
        }
        else if (player_powerup === "health_pack") {
            let health_text = this.entity_manager.addEntity("health_text");
            health_text.addComponent(components.CTransform(new Vector(480, 200), new Vector(480, 200), 1, velocity, 0));
            health_text.addComponent(components.CAnimation('+health', 1, 0, 0));
            setTimeout(() => health_text.destroy(), 1350)
        }
        else if (player_powerup === "transparent") {
            let drunk_text = this.entity_manager.addEntity("drunk_text");
            drunk_text.addComponent(components.CTransform(new Vector(470, 200), new Vector(0, 0), 1, velocity, 0));
            drunk_text.addComponent(components.CAnimation('drunk_mode', 1, 0, 0));
            setTimeout(() => drunk_text.destroy(), 1350)
        }
    }


    update(){
        // this function handles the update function, starting a game if it hasn't been already
        if (!this.gameStarted){
            this.startGame();
            this.entity_manager.update();
            this.gameStarted = true;
        }
        else {
            this.sfx = []
            this.sAnimation();
            this.sMovement();
            if(!this.isEditor){
                this.sInput();
                this.sGravity();
                this.sLifespan();
                this.sBars();
                this.sEnemyRayCasting();
                this.sEnemyAI();
                this.sCollision();
                this.sGameState();
            }
            else{
                this.sEditorInput();
                this.sEditor();
            }
            this.entity_manager.update();
        }
    }

    loadSfx(soundfile){
        this.sfx.push(soundfile);
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
        //Gameplay Input system
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        let CInput = player.getComponent('CInput');
        let playerTransform = player.getComponent('CTransform');
        let playerBounding = player.getComponent("CBoundingBox");

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
                let offsetX = playerTransform.scale === -1? playerTransform.position.x - 5: playerTransform.position.x + playerBounding.size.x + 5;
                this.entity_manager.addModel.bullet_knife(offsetX, playerTransform.position.y + 15, playerTransform.scale, player.tag);
                CInput.canShoot = false;
                this.loadSfx("laser");
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

        if (CInput.interact){
            // open door logic
            console.log("E pressed")
        }

        if (CInput.screech){
            // throw screech
            let game_running = player.getComponent("CGameRunning");
            console.log("O pressed");
            if (game_running.running) {
                if (CInput.canScreech) {
                    const screech_remaining = this.entity_manager.getEntitiesByTag("screech_remaining")[0];
                    const deliveries_left = this.entity_manager.getEntitiesByTag("deliveries_left")[0];
                    let screech_count = screech_remaining.getComponent('CScreech').screechCount;
                    let deliveries = deliveries_left.getComponent('CScore').score;
                    this.entity_manager.addModel.screech(playerTransform.position.x, playerTransform.position.y + 15, playerTransform.velocity, playerTransform.scale, player.tag);
                    this.loadSfx("RiftToGo");
                    screech_remaining.getComponent('CScreech').screechCount -= 1;
                    CInput.canScreech = false;
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
                this.loadSfx("special");
                CInput.canDrink = false;
                for (let entity of this.entity_manager.getEntitiesByTag("bar")) {
                    if (entity.getComponent('CState').state === "drunk") {
                        entity.getComponent('CBar').value = entity.getComponent('CBar').maxValue;
                    }
                }
                this.spawnPowerupTitle(screech_remaining);
                setTimeout(() => CInput.canDrink = true, config.time.drunk_duration)
            }
        }
    }

    sEditorInput(){
        //Level Editor Input
        const player = this.entity_manager.getEntitiesByTag("player")[0];
        let CInput = player.getComponent('CInput');

        CInput.up = this.lastInput[config.controls.up];
        CInput.down = this.lastInput[config.controls.down];
        CInput.left = this.lastInput[config.controls.left];
        CInput.right = this.lastInput[config.controls.right];

        if (this.lastInput[config.controls.new] === true){

            if(!this.selectedEntity){
                const position = this.mousePosition
                this.editorModels[this.editorModelIndex](position.x, position.y) //add new entity

                const entitiesToAdd = this.entity_manager.entitiesToAdd
                this.selectedEntity = entitiesToAdd[entitiesToAdd.length - 1] //the last added entity
            }

        }

        if(this.lastInput[config.controls.delete] === true){
            if(this.selectedEntity){
                this.selectedEntity.destroy()
                this.selectedEntity = null
            }
        }

        if(this.lastInput[config.controls.grid] === true){
            this.showGrid = !this.showGrid
        }

        if(this.selectedEntity) {
            const getNextModel = this.lastInput[config.controls.nextAni] === true
            const getLastModel = this.lastInput[config.controls.lastAni] === true

            if (getNextModel || getLastModel) {
                const offset = getNextModel ? 1 : -1
                const mod = (m,n) => ((m%n)+n)%n //JS is stupid; % can return -ve numbers
                this.editorModelIndex = mod(this.editorModelIndex + offset, this.editorModels.length)
                
                const oldPosition = this.selectedEntity.getComponent("CTransform").position
                this.editorModels[this.editorModelIndex](oldPosition.x, oldPosition.y) //create a new model
                this.selectedEntity.destroy()
                
                const entitiesToAdd = this.entity_manager.entitiesToAdd
                this.selectedEntity = entitiesToAdd[entitiesToAdd.length - 1] //the last added entity
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

        if (!game_running.running) {return}

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

        playerTransform.position.x += playerTransform.velocity.x;

        // truncate player speed if above max
        if (playerTransform.velocity.length() > config.player.maxspeed) {
            playerTransform.velocity.normalize();
            playerTransform.velocity = playerTransform.velocity.multiply(config.player.maxspeed);
        }

            if (playerState.state !== newState) {
                playerState.state = newState;
                this.updatePlayerAnimation();
            }

        playerTransform.previous_position = playerTransform.position;
        playerTransform.position = playerTransform.position.add(playerTransform.velocity);

        // update all bullets position based on velocity
        for (let entity of this.entity_manager.getEntities()){

            if (entity.tag !== "bullet" && entity.tag !== "screech"){continue}

            if (entity.hasComponent('CTransform')){
                let eTransform = entity.getComponent('CTransform');
                eTransform.position.x += eTransform.velocity.x;
                eTransform.position.y += eTransform.velocity.y;
                eTransform.previous_position = eTransform.position;
                eTransform.position = eTransform.position.add(eTransform.velocity);
            }

        }

        // powerup animation movements
        for (let shield of this.entity_manager.getEntitiesByTag("shield_on")) {
            let sTransform = shield.getComponent('CTransform');
            sTransform.position.x = playerTransform.position.x - 23;
            sTransform.position.y = playerTransform.position.y - 20;
        }
        for (let invincibility_on of this.entity_manager.getEntitiesByTag("invincibility_on")) {
            let sTransform = invincibility_on.getComponent('CTransform');
            sTransform.position.x = playerTransform.position.x - 11;
            sTransform.position.y = playerTransform.position.y - 10;
        }

    }

    sGravity(){
        const player = this.entity_manager.getEntitiesByTag('player')[0];
        let player_powerup = player.getComponent('CPowerup');
        for (let entity of this.entity_manager.getEntities()){
            if (entity.hasComponent('CGravity')){
                let eTransform = entity.getComponent('CTransform');
                let eGravity = entity.getComponent('CGravity');

                if (player_powerup.drunk){
                    eTransform.velocity.y += config.game_engine.drunk_gravity;
                }
                else {
                    eTransform.velocity.y += eGravity.gravity;
                }
            }
        }
    }

    sCollision(){

        const player = this.entity_manager.getEntitiesByTag("player")[0];
        let playerTransform = player.getComponent('CTransform');

        for (let tile of this.entity_manager.getEntitiesByTag("tile")){

            if (!tile.hasComponent("CBoundingBox")) {continue;}

            let tileTransform = tile.getComponent("CTransform");

            // tile-player collision
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

            // tile-enemy collision
            for (let enemy of this.entity_manager.getEntitiesByTag("enemy")){

                let enemyTransform = enemy.getComponent("CTransform");
                let overlap = physics.getOverLap(tile, enemy);

                if (overlap.x > 0 && overlap.y > 0) {
                    let prevOverlap = physics.getPrevOverLap(tile, enemy);
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

            // tile-bullet collision
            for (let bullet of this.entity_manager.getEntitiesByTag("bullet")) {
                let overlap = physics.getOverLap(tile, bullet);
                if (overlap.x > 0 && overlap.y > 0){
                    bullet.destroy();
                }
            }
        }

        // enemy - player collision
        for (let enemy of this.entity_manager.getEntitiesByTag("enemy")){

            let overlap = physics.getOverLap(enemy, player);
            let playerHealth = player.getComponent('CHealth');
            let playerPowerup = player.getComponent('CPowerup');
            let game_running = player.getComponent("CGameRunning");
            let shield_on = this.entity_manager.getEntitiesByTag("shield_on")[0];

            if (overlap.x > 0 && overlap.y > 0){
                if (playerPowerup.invincibility) {
                    return;
                }
                else {
                    if (playerPowerup.shield) {
                        playerPowerup.shield = false;
                        playerHealth.invincible = true;
                        if (shield_on !== undefined) {
                            shield_on.destroy();
                        }
                        setTimeout(() => playerHealth.invincible = false, 800);
                        return;
                    }
                    if (!playerHealth.invincible) {
                        playerHealth.invincible = true;
                        playerHealth.health -= 20;
                        // Invincibility frames
                        setTimeout(() => playerHealth.invincible = false, 800)
                    }
                    if (playerHealth.health === 0) {
                        this.loadSfx("playerhit");
                        console.log('player dead');
                    }
                }
            }

            for (let bullet of this.entity_manager.getEntitiesByTag("bullet")) {
                const score = this.entity_manager.getEntitiesByTag("score")[0];
                let attacker = bullet.getComponent("CAttacker").attacker;
                console.log('attacker', attacker);
                if (attacker === "enemy"){continue}
                let overlap = physics.getOverLap(enemy, bullet);
                if (overlap.x > 0 && overlap.y > 0){
                    bullet.destroy();
                    if (enemy.getComponent("CEnemyAI").enemy_type === "boss"){continue}
                    score.getComponent('CScore').score += 10;
                    enemy.getComponent('CHealth').show = true;
                    enemy.getComponent('CHealth').health--;

                    setTimeout(() => { enemy.getComponent('CHealth').show = false; }, 2000);

                    if (enemy.getComponent('CHealth').health === 0) {
                        this.updateEnemyAnimation(enemy, true);
                        setTimeout( () => {enemy.destroy();}, 50);
                    }
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
                    this.spawnPowerupTitle(powerup);
                }
                if (powerup.getComponent('CAnimation').animName === 'Invincibility') {
                    // temporary invincibility
                    console.log("inv")
                    player.getComponent('CPowerup').invincibility = true;
                    powerup.destroy();
                    this.spawnInvincibility();
                    setTimeout(() => player.getComponent('CPowerup').invincibility = false, 10000)
                    this.spawnPowerupTitle(powerup);
                }
                if (powerup.getComponent('CAnimation').animName === 'Shield') {
                    // shield
                    console.log("shield")
                    player.getComponent('CPowerup').shield = true;
                    powerup.destroy();
                    this.spawnShield();
                    this.spawnPowerupTitle(powerup);
                }

                if (powerup.getComponent('CAnimation').animName === 'health_pack') {
                    // health
                    console.log("shield")
                    if (player.getComponent('CHealth').health < 100) {
                        player.getComponent('CHealth').health += 20;
                    }
                    powerup.destroy();
                    this.spawnPowerupTitle(powerup);
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
                    if (enemy.getComponent("CHealth").invincible === true){continue}
                    if (enemy.getComponent("CEnemyAI").enemy_type === "boss"){
                        enemy.getComponent('CHealth').health--;

                        if (enemy.getComponent('CHealth').health === 0) {
                            this.updateEnemyAnimation(enemy, true);
                            setTimeout( () => {enemy.destroy();}, 50);
                            const bossTransform = enemy.getComponent("CTransform").position
                            this.entity_manager.addModel.level_end_taxi(bossTransform.x, bossTransform.y);
                        }

                        else {
                            enemy.getComponent('CBoss').currentRegenTime = enemy.getComponent('CBoss').maxRegenTime;
                            enemy.getComponent('CHealth').invincible = true;
                            setTimeout(() => enemy.getComponent('CHealth').invincible = false, enemy.getComponent('CBoss').invincibilityTime);
                        }
                    }
                    else {
                        enemy.destroy();
                    }
                    score.getComponent('CScore').score += 35;
                    this.spawnBoom(bottle);
                    bottle.destroy();
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
                this.loadSfx("doorOpen");
                this.sLevelEnd();

            }
        }

        // bullet-player collision
        for (let bullet of this.entity_manager.getEntitiesByTag("bullet")){
            let attacker = bullet.getComponent("CAttacker").attacker;
            let playerPowerup = player.getComponent('CPowerup');
            if (attacker === "player"){continue};
            let overlap = physics.getOverLap(player, bullet);
            let playerHealth = player.getComponent('CHealth');
            let shield_on = this.entity_manager.getEntitiesByTag("shield_on")[0];
            if (overlap.x > 0 && overlap.y > 0){
                if (playerPowerup.invincibility) {
                    return;
                }
                else {
                    if (playerPowerup.shield) {
                        playerPowerup.shield = false;
                        playerHealth.invincible = true;
                        if (shield_on !== undefined) {
                            shield_on.destroy();
                        }
                        setTimeout(() => playerHealth.invincible = false, 800);
                        return;
                    }
                    if (!playerHealth.invincible) {
                        playerHealth.invincible = true;
                        playerHealth.health -= 20;
                        // Invincibility frames
                        setTimeout(() => playerHealth.invincible = false, 800)
                    }
                    if (playerHealth.health === 0) {
                        this.loadSfx("playerhit")
                        console.log('player dead');
                    }
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
            let oldState = enemyAI.player_detected;
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

            }
            enemyAI.playerPosition = playerOffSet;
            enemyAI.player_detected = playerDetected;
            //enemyAI.show = playerDetected;

            if (playerDetected !== oldState){
                this.updateEnemyAnimation(enemy);
            }//
        }
    }

    sEnemyAI(){

        const player = this.entity_manager.getEntitiesByTag("player")[0];

        for (let enemy of this.entity_manager.getEntitiesByTag("enemy")){
            const enemyTransform = enemy.getComponent('CTransform');
            const enemyAI = enemy.getComponent("CEnemyAI");
            if(enemyAI.enemy_type == "boss"){
                this.updateCounters(enemy)
            }

            // if not aggro mode
            if (enemyAI.player_detected === false){
                let direction = enemyAI.currentRoam < 0 && enemyAI.currentRoam > -1* enemyAI.roamDistance? -1: 1;
                enemyAI.currentRoam--;
                // reset roam
                if (enemyAI.currentRoam < -1*enemyAI.roamDistance){
                    enemyAI.currentRoam = enemyAI.roamDistance;
                    enemyTransform.velocity.x = 0;
                }
                enemyTransform.velocity.x += direction * config.enemy.melee.speed;

                // truncate speed if above max
                if (enemyTransform.velocity.length() > config.enemy.melee.maxSpeed) {
                    enemyTransform.velocity.normalize();
                    enemyTransform.velocity = enemyTransform.velocity.multiply(config.enemy.melee.maxSpeed * 0.25 );
                }
            }
            // if detected player
            else {
                const playerTransform = player.getComponent('CTransform');
                let direction = playerTransform.position.subtract(enemyTransform.position);
                let bounds = enemy.getComponent("CBoundingBox");
                let offsetX = enemyTransform.scale === 1? bounds.size.x + enemyTransform.position.x + 5: enemyTransform.position.x - 5;
                let offsetY = enemyTransform.position.y + 15;

                switch (enemyAI.enemy_type) {

                    case "melee":
                        direction.normalize();
                        direction = direction.multiply(config.enemy.melee.maxSpeed * 0.5);
                        direction.y = enemyTransform.velocity.y;
                        direction.x += enemyTransform.velocity.x / 2;
                        enemyTransform.velocity = direction;

                        // truncate speed if above max
                        if (enemyTransform.velocity.length() > config.enemy.melee.maxSpeed) {
                            enemyTransform.velocity.normalize();
                            enemyTransform.velocity = enemyTransform.velocity.multiply(config.enemy.melee.maxSpeed * 0.25);
                        }
                        break;

                    case "ranged":
                        direction.normalize();
                        direction = direction.multiply(config.enemy.ranged.maxSpeed * 0.05);
                        direction.y = enemyTransform.velocity.y;
                        direction.x += enemyTransform.velocity.x;
                        enemyTransform.velocity = direction;

                        if (enemyAI.canAttack){
                            this.entity_manager.addModel.bullet_knife(offsetX, offsetY, enemyTransform.scale, enemy.tag);
                            this.loadSfx("laser");
                            enemyAI.canAttack = false;
                            setTimeout( () => {enemyAI.canAttack = true}, 1000)
                        }
                        // truncate speed if above max
                        if (enemyTransform.velocity.length() > config.enemy.ranged.maxSpeed) {
                            enemyTransform.velocity.normalize();
                            enemyTransform.velocity = enemyTransform.velocity.multiply(config.enemy.ranged.maxSpeed * 0.05);
                        }
                        break;

                    case "flying":
                        direction.normalize();
                        direction = direction.multiply(config.enemy.flying.maxSpeed * 0.75);
                        direction.y = enemyTransform.velocity.y;
                        direction.x += enemyTransform.velocity.x / 2;
                        enemyTransform.velocity = direction;
                        offsetY = enemyTransform.position.y + bounds.size.y + 5;

                        if (enemyAI.canAttack){
                            this.entity_manager.addModel.bullet_dropping(offsetX, offsetY, enemyTransform.scale, enemyTransform.velocity, enemy.tag);
                            this.loadSfx("laser");
                            enemyAI.canAttack = false;
                            setTimeout( () => {enemyAI.canAttack = true}, 2000)
                        }

                        // truncate speed if above max
                        if (enemyTransform.velocity.length() > config.enemy.flying.maxSpeed) {
                            enemyTransform.velocity.normalize();
                            enemyTransform.velocity = enemyTransform.velocity.multiply(config.enemy.flying.maxSpeed * 0.25);
                        }
                        break;

                    case "boss":
                        direction.normalize();
                        direction = direction.multiply( 0.25);
                        direction.y = enemyTransform.velocity.y;
                        direction.x += enemyTransform.velocity.x / 2;
                        enemyTransform.velocity = direction;
                        offsetY = enemyTransform.position.y + 55;
                        let r = Math.floor(Math.random()*100);

                        if( (r === 95) ){
                            if(enemy.getComponent("CState").state === "grounded") {
                                enemyTransform.position.y += -100
                                enemy.getComponent("CState").state = "jumping"
                            }
                            else {
                                if(enemy.getComponent("CState").state != "grounded"){
                                    enemy.getComponent("CState").state = "grounded"
                                }
                            }
                        }

                        if (enemyAI.canAttack){
                            if (Math.random() < 0.7){
                                this.entity_manager.addModel.bullet_knife(offsetX, offsetY, enemyTransform.scale, enemy.tag);
                            }
                            else {
                                this.entity_manager.addModel.enemy_melee_mini_seal(offsetX, offsetY);
                            }
                            enemyAI.canAttack = false;
                            setTimeout( () => {enemyAI.canAttack = true}, 2000)
                        }

                        // truncate speed if above max
                        if (enemyTransform.velocity.length() > config.enemy.flying.maxSpeed) {
                            enemyTransform.velocity.normalize();
                            enemyTransform.velocity = enemyTransform.velocity.multiply(config.enemy.flying.maxSpeed * 0.25);
                        }
                        break;

                }
            }

            enemyTransform.position.x += enemyTransform.velocity.x;
            enemyTransform.previous_position = enemyTransform.position;
            enemyTransform.position = enemyTransform.position.add(enemyTransform.velocity);

            if (enemyTransform.velocity.x < 0) {
                enemyTransform.scale = -1;
            }

            if (enemyTransform.velocity.x > 0) {
                enemyTransform.scale = 1;
            }
        }
    }

    regenBoss(boss){
        const bossHealth = boss.getComponent('CHealth');
        bossHealth.health = Math.min(bossHealth.health + 2, bossHealth.maxHealth)
    }

    teleportBoss(boss){
        const bossTransform = boss.getComponent('CTransform');
        const teleportPoints = [[700,525],[289,400],[700,100],[950,290]]
        let location = teleportPoints[Math.floor(Math.random() * teleportPoints.length)];
        console.log('teleport set to', location)
        bossTransform.position.x = location[0];
        bossTransform.position.y = location[1];
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

    updateEnemyAnimation(enemy, dead=false){
        //console.log('updated enemy animation');

        let animation = enemy.getComponent("CAnimation");
        let state = enemy.getComponent("CEnemyAI");
        let animationOptions = enemy.getComponent('CEnemyAnim');

        if (dead === true){
            animation.animName = animationOptions.deadAnim;
            animation.numOfFrames = animationOptions.deadAnimFrames;
        }
        if (state.player_detected === true){
            animation.animName = animationOptions.attackAnim;
            animation.numOfFrames = animationOptions.attackAnimFrames;
        }
        else {
            animation.animName = animationOptions.idleAnim;
            animation.numOfFrames = animationOptions.idleAnimFrames;
        }
        animation.currentFrame = 0;
    }

    sEditor(){
        // Updating entity position according to mouse position
        if(this.selectedEntity){
            let entity = this.selectedEntity
            let eTransform = entity.getComponent('CTransform')
            if(this.showGrid){
                eTransform.position.x = 64 * Math.floor(this.mousePosition.x / 64)
                eTransform.position.y = 64 * Math.floor((this.mousePosition.y - 720%64) / 64) + 720%64
            }
            else{
                eTransform.position.x = this.mousePosition.x
                eTransform.position.y = this.mousePosition.y
            }
        }

    }

    setSelectedEntity(entity){
        this.selectedEntity = entity
    }

    setMousePosition(x, y){
        this.mousePosition.x = x
        this.mousePosition.y = y
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
        let level_state = player.getComponent("CLevelState");

        game_running.running = false;

        if (deliveries > 0) {
            console.log("You missed one or more deliveries, game over!")
            level_state.level_state = "failed"
            // show level restart screen
        }

        if (screech === 0 && deliveries > 0) {
            console.log("You ran out of screech, game over!");
            level_state.level_state = "failed"
            // show level restart screen
        }
        if (deliveries === 0){
            console.log("level complete");
            level_state.level_state = "complete"
            // segue player back to overworld with next level unlocked
            // store level score in player collection in database
        }

    }

    // check if game running is false, if so stop game
    sGameState() {

        const player = this.entity_manager.getEntitiesByTag("player")[0];
        const score = this.entity_manager.getEntitiesByTag("score")[0];
        const screech_remaining = this.entity_manager.getEntitiesByTag("screech_remaining")[0];
        const deliveries_left = this.entity_manager.getEntitiesByTag("deliveries_left")[0];

        let game_running = player.getComponent("CGameRunning").running;
        let level_score = score.getComponent('CScore').score; // will use this later to write score to db after each level
        let screech = screech_remaining.getComponent('CScreech').screechCount;
        let health = player.getComponent('CHealth').health;
        let level_state = player.getComponent("CLevelState");
        let deliveries = deliveries_left.getComponent('CScore').score;

        if (!game_running) {

            if (screech <= 0 && deliveries > 0) {
                console.log("Ran out of screech!")
                level_state.level_state = "failed"
            }

            if (health <= 0) {
                console.log("You ran out of health!")
                level_state.level_state = "failed"
            }

        }
    }

    returnGameState(){
        return {
            showGrid: this.showGrid,
            entities: this.entity_manager.getEntities(),
            sfx: this.sfx

        }
    }

    setEditorEntityType(entityType){
        this.editorEntityType = entityType
    }

    setEditorMode(isEditor){
        this.isEditor = isEditor
    }

    updateCounters(enemy){
        const bossEnemyAI = enemy.getComponent("CBoss")
        // Calculating the regeneration and teleportation factors
        bossEnemyAI.currentTeleportTime -= 30;
        bossEnemyAI.currentRegenTime -= 50;
        // Calling the teleportation and regeneration fucntions
        if(bossEnemyAI.currentTeleportTime <= 0){
            this.teleportBoss(enemy)
            bossEnemyAI.currentTeleportTime = bossEnemyAI.maxTeleportTime
        }
        if(bossEnemyAI.currentRegenTime <= 0){
            this.regenBoss(enemy)
            bossEnemyAI.currentRegenTime = bossEnemyAI.maxRegenTime
        }
    }

}

module.exports = GameEngine;