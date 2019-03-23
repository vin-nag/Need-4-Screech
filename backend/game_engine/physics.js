const Vector = require("./vector");

function getOverLap(entityA, entityB){
    let transformA = entityA.getComponent("CTransform");
    let transformB = entityB.getComponent("CTransform");
    let boundingBoxA = entityA.getComponent("CBoundingBox");
    let boundingBoxB = entityB.getComponent("CBoundingBox");

    let delta = transformA.position.subtract(transformB.position);
    delta = delta.abs();
    //new Vector(Math.abs(transformA.position.x - transformB.position.x), Math.abs(transformA.position.y - transformB.position.y));

    let ox = boundingBoxA.halfSize.x + boundingBoxB.halfSize.x - delta.x;
    let oy = boundingBoxA.halfSize.y + boundingBoxB.halfSize.y - delta.y;

    return new Vector(ox, oy);
}

function getPrevOverLap(entityA, entityB){
    let transformA = entityA.getComponent("CTransform");
    let transformB = entityB.getComponent("CTransform");
    let boundingBoxA = entityA.getComponent("CBoundingBox");
    let boundingBoxB = entityB.getComponent("CBoundingBox");

    let delta = transformA.previous_position.subtract(transformB.previous_position);
    delta = delta.abs()
    //new Vector(Math.abs(transformA.previous_position.x - transformB.previous_position.x), Math.abs(transformA.previous_position.y - transformB.previous_position.y));

    let ox = boundingBoxA.halfSize.x + boundingBoxB.halfSize.x - delta.x;
    let oy = boundingBoxA.halfSize.y + boundingBoxB.halfSize.y - delta.y;

    return new Vector(ox, oy);
}

function getPointsBetweenVectors(pointA, pointB){

    function slope(pointA, pointB) {
        if (pointA.x === pointB.x) {
            return null;
        }

        return (pointB.y - pointA.y) / (pointB.x - pointA.x);
    }

    function intercept(point, slope) {
        if (slope === null) {
            return point.x;
        }

        return point.y - slope * point.x;
    }

    let m = slope(pointA, pointB);
    let b = intercept(pointA, m);

    let coordinates = [];

    if (pointA.x <= pointB.x){
        for (let x = pointA.x; x <= pointB.x; x++) {
            let y = m * x + b;
            coordinates.push([x, y]);
        }
    }
    else {
        for (let x = pointA.x; x >= pointB.x; x--){
            let y = m * x + b;
            coordinates.push([x,y])
        }
    }

    return coordinates
}

function pointIntersectingPolygon(point, vectorPosition, vectorSize){

    let vectorBounded = vectorPosition.add(vectorSize);
    let xIntersection = vectorPosition.x <= point[0] && point[0] <= vectorBounded.x? true: false
    let yIntersection = vectorPosition.y <= point[1] && point[1] <= vectorBounded.y? true: false

    return xIntersection && yIntersection;
}

module.exports = {getOverLap, getPrevOverLap, getPointsBetweenVectors, pointIntersectingPolygon};
