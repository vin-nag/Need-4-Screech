
const components = require("./components");
const entity_manager_file = require("./entity_manager");

const entity_manager = new entity_manager_file();



function spawnPlayer() {
    player = entity_manager.addEntity( "player");
    player.addComponent(components.CLifeSpan(5));
    player.addComponent(components.CGravity(-9.8));
    player.addComponent(components.CHealth(100));
    up = false;
    down = false;
    left = false;
    right = true;
    canShoot = false;
    player.addComponent(components.CInput(up, down, left, right, canShoot));
    return player;
}




function play() {
    //console.log(entity_manager.entities);
    player = spawnPlayer();
    entity_manager.update();
    //console.log(entity_manager.entities);

    player.destroy();
    //console.log(player.active);
    entity_manager.update();
    console.log(entity_manager.entities);

}

play();