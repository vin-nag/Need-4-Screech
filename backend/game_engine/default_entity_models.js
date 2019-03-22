// imports
const components = require("./components");
const EntityManager = require("./entity_manager");
const config = require("./../../config-template.json");
const Vector = require("./vector");
const entity_manager = new EntityManager();


const player = (x=0, y=0) => {

    const player_entity = entity_manager.addEntity("player");

    player_entity.addComponent(components.CLifeSpan(config.player.lifeSpan));
    player_entity.addComponent(components.CGravity(config.game_engine.gravity));
    player_entity.addComponent(components.CHealth(config.player.health, config.player.health, false, true));
    player_entity.addComponent(components.CAnimation('skeet_idle',4,0,0.25));
    player_entity.addComponent(components.CInput(false, false, false, false, false, true));
    player_entity.addComponent(components.CTransform( new Vector(x, y),  new Vector(0, 0),1,  new Vector(0, 0),0));
    player_entity.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
    player_entity.addComponent(components.CState("grounded"));

    return player_entity
};

const bar_timer = (x=10, y=10) => {

    const timer_entity = entity_manager.addEntity("bar");

    timer_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
    timer_entity.addComponent(components.CBar(config.time.limit, config.time.limit, "#FFFF00"));
    timer_entity.addComponent(components.CAnimation("timer", 1, 0, 0));
    timer_entity.addComponent(components.CState("timer"));

    return timer_entity
};

const bar_health = (x=475, y=10) => {

    let health_entity = entity_manager.addEntity("bar");

    health_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
    health_entity.addComponent(components.CBar(config.player.health, config.player.health, "#8B0000"));
    health_entity.addComponent(components.CAnimation("health", 1, 0, 0));
    health_entity.addComponent(components.CState("health"));

    return health_entity
};


const bar_screech = (x=950, y=10) => {

    const screech_entity = entity_manager.addEntity("bar");
    screech_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
    screech_entity.addComponent(components.CBar(config.player.health, config.player.health, "#9D702E"));
    screech_entity.addComponent(components.CAnimation("drunk", 1, 0, 0));
    screech_entity.addComponent(components.CState("drunk"));

    return screech_entity
};

const bullet_bottle = (x=0, y=0) => {

    const bullet_entity = entity_manager.addEntity("bullet");

    bullet_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(12, 0), 0));
    bullet_entity.addComponent(components.CBoundingBox(new Vector(48, 16), new Vector(24, 8)));
    bullet_entity.addComponent(components.CAnimation('screech', 1, 0, 0));
    bullet_entity.addComponent(components.CState('shooting'));
    bullet_entity.addComponent(components.CLifeSpan(1000));

    return bullet_entity
};

const decorator_pole_1 = (x=0, y=0) => {

    const pole_1_entity = entity_manager.addEntity("decorator");
    pole_1_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
    pole_1_entity.addComponent(components.CAnimation("pole1", 1, 0, 0));

    return pole_1_entity;
};

const decorator_pole_2 = (x=0, y=0) => {

    const pole_2_entity = entity_manager.addEntity("decorator");
    pole_2_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
    pole_2_entity.addComponent(components.CAnimation("pole2", 1, 0, 0));

    return pole_2_entity;
};

const decorator_pole_3 = (x=0, y=0) => {

    const pole_3_entity = entity_manager.addEntity("decorator");
    pole_3_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
    pole_3_entity.addComponent(components.CAnimation("pole3", 1, 0, 0));

    return pole_3_entity;
};

const decorator_lantern = (x=0, y=0) => {

    const lantern_entity = entity_manager.addEntity("decorator");
    lantern_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y), 1, new Vector(0, 0), 0));
    lantern_entity.addComponent(components.CAnimation("lantern", 4, 0, 0.25));

    return lantern_entity;
};

const enemy_snake = (x=0, y=0) => {

    const enemy_entity = entity_manager.addEntity("enemy");

    enemy_entity.addComponent(components.CLifeSpan(config.player.lifeSpan));
    enemy_entity.addComponent(components.CGravity(config.game_engine.gravity));
    enemy_entity.addComponent(components.CHealth(2, 2, false, false));
    enemy_entity.addComponent(components.CAnimation('snake_walk',7,0,0.25));
    enemy_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y),1, new Vector(0, 0),0));
    enemy_entity.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));
    enemy_entity.addComponent(components.CState("grounded"));

    return enemy_entity
};

const tile_brick = (x=0, y=0) => {

    const tile_brick_entity = entity_manager.addEntity("tile");

    tile_brick_entity.addComponent(components.CAnimation('GreyTile',1,0,0));
    tile_brick_entity.addComponent(components.CTransform(new Vector(x, y), new Vector(x, y),1, new Vector(0, 0),0));
    tile_brick_entity.addComponent(components.CBoundingBox(new Vector(64, 64), new Vector(32, 32)));

    return tile_brick_entity
};

const background_img_george = () => {

    const img_entity = entity_manager.addEntity("bg-img");

    img_entity.addComponent(components.CAnimation('george_background', 1, 0, 0));
    img_entity.addComponent(components.CTransform(new Vector(0, 0), new Vector(0, 0), 1));

    return img_entity
};

const background_img_ice = () => {

    const img_entity = entity_manager.addEntity("bg-img");

    img_entity.addComponent(components.CAnimation('ice_background', 1, 0, 0));
    img_entity.addComponent(components.CTransform(new Vector(0, 0), new Vector(0, 0), 1));

    return img_entity
};


module.exports = {player, bar_timer, bar_health, bar_screech, tile_brick, enemy_snake, decorator_lantern, decorator_pole_1, decorator_pole_2, decorator_pole_3, bullet_bottle, background_img_george};
