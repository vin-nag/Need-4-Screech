const Vector = require("./vector");

function getOverLap(entityA, entityB){
    let transformA = entityA.getComponent("CTransform");
    let transformB = entityB.getComponent("CTransform");
    let boundingBoxA = entityA.getComponent("CBoundingBox");
    let boundingBoxB = entityB.getComponent("CBoundingBox");

    let delta = new Vector(Math.abs(transformA.position.x - transformB.position.x), Math.abs(transformA.position.y - transformB.position.y));

    let ox = boundingBoxA.halfSize.x + boundingBoxB.halfSize.x - delta.x;
    let oy = boundingBoxA.halfSize.y + boundingBoxB.halfSize.y - delta.y;

    return new Vector(ox, oy);
}

function getPrevOverLap(entityA, entityB){
    let transformA = entityA.getComponent("CTransform");
    let transformB = entityB.getComponent("CTransform");
    let boundingBoxA = entityA.getComponent("CBoundingBox");
    let boundingBoxB = entityB.getComponent("CBoundingBox");

    let delta = new Vector(Math.abs(transformA.previous_position.x - transformB.previous_position.x), Math.abs(transformA.previous_position.y - transformB.previous_position.y));

    let ox = boundingBoxA.halfSize.x + boundingBoxB.halfSize.x - delta.x;
    let oy = boundingBoxA.halfSize.y + boundingBoxB.halfSize.y - delta.y;

    return new Vector(ox, oy);
}

module.exports = {getOverLap, getPrevOverLap};
