// imports
const components = require("./components");
const config = require("./../../config-template.json");
const Vector = require("./vector");

class EntityModels {

    constructor(entity_manager){
        this.entity_manager = entity_manager;
    }

    player(x=0, y=0){
        const player_entity = this.entity_manager.addEntity("player");
        player_entity.addComponent(components.CLifeSpan(config.player.lifeSpan));
        player_entity.addComponent(components.CGravity(config.game_engine.gravity));
        player_entity.addComponent(components.CHealth(config.player.health, config.player.health, false, false));
        player_entity.addComponent(components.CAnimation('skeet_idle', 4, 0, 0.25));
        player_entity.addComponent(components.CInput(false, false, false, false, false, true, true, true));
        player_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(0, 0), 1, new Vector(0, 0), 0));
        player_entity.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
        player_entity.addComponent(components.CState("grounded"));
        player_entity.addComponent(components.CPowerup(false, false, false, false))
        player_entity.addComponent(components.CScreech(25))
        player_entity.addComponent(components.CGameRunning(true));
    };

    bar_timer(x=10, y=10) {
        const timer_entity = this.entity_manager.addEntity("bar");
        timer_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        timer_entity.addComponent(components.CBar(config.time.limit, config.time.limit, "#FFFF00"));
        timer_entity.addComponent(components.CAnimation("timer", 1, 0, 0));
        timer_entity.addComponent(components.CState("timer"));
    };

    bar_health(x=475, y=10) {
        let health_entity = this.entity_manager.addEntity("bar");
        health_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        health_entity.addComponent(components.CBar(config.player.health, config.player.health, "#8B0000"));
        health_entity.addComponent(components.CAnimation("health", 1, 0, 0));
        health_entity.addComponent(components.CState("health"));
    };

    bar_screech(x=950, y=10) {
        const screech_entity = this.entity_manager.addEntity("bar");
        screech_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        screech_entity.addComponent(components.CBar(0, config.player.drunk, "#9D702E"));
        screech_entity.addComponent(components.CAnimation("drunk", 1, 0, 0));
        screech_entity.addComponent(components.CState("drunk"));
    };

    bullet_bottle(x=0, y=0) {
        const bullet_entity = this.entity_manager.addEntity("bullet");
        bullet_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(12, 0), 0));
        bullet_entity.addComponent(components.CBoundingBox(new Vector(48, 16), new Vector(24, 8)));
        bullet_entity.addComponent(components.CAnimation('screech', 1, 0, 0));
        bullet_entity.addComponent(components.CState('shooting'));
        bullet_entity.addComponent(components.CLifeSpan(1000));
    };

    decorator_pole_1(x=0, y=0) {
        const pole_1_entity = this.entity_manager.addEntity("decorator");
        pole_1_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        pole_1_entity.addComponent(components.CAnimation("pole1", 1, 0, 0));
    };

    decorator_pole_2(x=0, y=0) {
        const pole_2_entity = this.entity_manager.addEntity("decorator");
        pole_2_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        pole_2_entity.addComponent(components.CAnimation("pole2", 1, 0, 0));
    };

    decorator_pole_3(x=0, y=0) {
        const pole_3_entity = this.entity_manager.addEntity("decorator");
        pole_3_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        pole_3_entity.addComponent(components.CAnimation("pole3", 1, 0, 0));
    };

    decorator_lantern(x=0, y=0) {
        const lantern_entity = this.entity_manager.addEntity("decorator");
        lantern_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        lantern_entity.addComponent(components.CAnimation("lantern", 4, 0, 0.25));
    };

    decorator_van(x=0, y=0) {
        const van_entity = this.entity_manager.addEntity("decorator");
        van_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        van_entity.addComponent(components.CAnimation("van", 1, 0, 0));
    }

    level_end_taxi(x=0, y=0) {
        const taxi_entity = this.entity_manager.addEntity("taxi");
        taxi_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        taxi_entity.addComponent(components.CAnimation("jiffy", 1, 0, 0));
        taxi_entity.addComponent(components.CBoundingBox(new Vector(200, 120), new Vector(100, 60)));
    }

    enemy_snake(x=0, y=0) {
        const enemy_entity = this.entity_manager.addEntity("enemy");
        enemy_entity.addComponent(components.CLifeSpan(config.player.lifeSpan));
        enemy_entity.addComponent(components.CGravity(config.game_engine.gravity));
        enemy_entity.addComponent(components.CHealth(2, 2, false, false));
        enemy_entity.addComponent(components.CAnimation('snake_walk', 7, 0, 0.25));
        enemy_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        enemy_entity.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
        enemy_entity.addComponent(components.CEnemyAI("melee",  5, config.enemy.melee.roamDistance, 5000, config.enemy.melee.sight, false, false, new Vector(0, 0)));
        enemy_entity.addComponent(components.CState("grounded"));
    };

    tile_brick(x=0, y=0) {
        const tile_brick_entity = this.entity_manager.addEntity("tile");
        tile_brick_entity.addComponent(components.CAnimation('GreyTile', 1, 0, 0));
        tile_brick_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        tile_brick_entity.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
    };

    tile_grey_left(x=0, y=0) {
        const tile_brick_entity = this.entity_manager.addEntity("tile");
        tile_brick_entity.addComponent(components.CAnimation('grey_tile_left', 1, 0, 0));
        tile_brick_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        tile_brick_entity.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
    };

    tile_grey_right(x=0, y=0) {
        const tile_brick_entity = this.entity_manager.addEntity("tile");
        tile_brick_entity.addComponent(components.CAnimation('grey_tile_right', 1, 0, 0));
        tile_brick_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        tile_brick_entity.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
    };

    tile_grey_center(x=0, y=0) {
        const tile_brick_entity = this.entity_manager.addEntity("tile");
        tile_brick_entity.addComponent(components.CAnimation('grey_tile_center', 1, 0, 0));
        tile_brick_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        tile_brick_entity.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
    };

    background_img_george() {
        const img_entity = this.entity_manager.addEntity("bg-img");
        img_entity.addComponent(components.CAnimation('george_background', 1, 0, 0));
        img_entity.addComponent(components.CTransform(new Vector(0, 0), new Vector(0, 0), 1));
    };

    background_img_ice() {
        const img_entity = this.entity_manager.addEntity("bg-img");
        img_entity.addComponent(components.CAnimation('ice_background', 1, 0, 0));
        img_entity.addComponent(components.CTransform(new Vector(0, 0), new Vector(0, 0), 1));
    };

    powerup_speed(x=0, y=0) {
        const powerup_entity = this.entity_manager.addEntity("powerup");
        powerup_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        powerup_entity.addComponent(components.CAnimation('SuperSpeed', 4, 0, .50));
        powerup_entity.addComponent(components.CBoundingBox(new Vector(20, 10), new Vector(10, 5)));
        return powerup_entity
    };

    powerup_invincible(x=0, y=0) {
        const powerup_entity = this.entity_manager.addEntity("powerup");
        powerup_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        powerup_entity.addComponent(components.CAnimation('Invincibility', 4, 0, .50));
        powerup_entity.addComponent(components.CBoundingBox(new Vector(20, 10), new Vector(10, 5)));
    };

    powerup_shield(x=0, y=0) {
        const powerup_entity = this.entity_manager.addEntity("powerup");
        powerup_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        powerup_entity.addComponent(components.CAnimation('Shield', 4, 0, .50));
        powerup_entity.addComponent(components.CBoundingBox(new Vector(20, 10), new Vector(10, 5)));
    };

    powerup_health(x=0, y=0) {
        const powerup_entity = this.entity_manager.addEntity("powerup");
        powerup_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        powerup_entity.addComponent(components.CAnimation('health_pack', 1, 0, 0));
        powerup_entity.addComponent(components.CBoundingBox(new Vector(20, 10), new Vector(10, 5)));
    }

    checkpoints(x=0, y=0) {
        const checkpoint = this.entity_manager.addEntity("checkpoint");
        checkpoint.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        checkpoint.addComponent(components.CAnimation('checkpoint_small', 1, 0, 0));
        checkpoint.addComponent(components.CBoundingBox(new Vector(64, 130), new Vector(32, 70)));
    }

    deliveries_left(deliveries_left, x=210, y=140) {
        const deliveries = this.entity_manager.addEntity("deliveries_left");
        deliveries.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        deliveries.addComponent(components.CAnimation('transparent', 1, 0, 0));
        deliveries.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
        deliveries.addComponent(components.CScore(deliveries_left));
    }

    screech_remaining(screech, x=675, y=140) {
        const screech_remaining = this.entity_manager.addEntity("screech_remaining");
        screech_remaining.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        screech_remaining.addComponent(components.CAnimation('transparent', 1, 0, 0));
        screech_remaining.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
        screech_remaining.addComponent(components.CScreech(screech));
    }

    score(x=1150, y=140) {
        const score = this.entity_manager.addEntity("score");
        score.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        score.addComponent(components.CAnimation('transparent', 1, 0, 0));
        score.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
        score.addComponent(components.CScore(0));
    }

    game_bar(x=0, y=0) {
        const game_bar = this.entity_manager.addEntity("game_bar");
        game_bar.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
        game_bar.addComponent(components.CAnimation('ice_bar', 1, 0, 0));
    }

}

module.exports = EntityModels;
