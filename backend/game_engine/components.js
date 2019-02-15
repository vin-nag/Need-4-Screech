// This module defines the various components needed for our game using the ECS architecture

/* this method is for the lifespan component
@param {int} lifespan lifespan of an entity
*/
const CLifeSpan = (lifespan) => ({name: "CLifeSpan", lifespan});

/* this method is for the transform component. We will create vector objects and use them later
@param {array} position position of the entity
@param {array} previous_position previous position of the entity
@param {array} scale scale of of the entity
@param {array} velocity velocity of the entity
@param {float} angle angle of the entity
*/
const CTransform = (position, previous_position, scale, velocity, angle=null) => ({name: "CTransform", position, previous_position, scale, velocity, angle});

/* this method is for the gravity component
@param {float} gravity gravity of the entity
*/
const CGravity = (gravity) => ({name: "CGravity", gravity});

/* this method is for the states (such as jumping etc) component
@param {string} state state of the entity
*/
const CState = (state) => ({name: "CState", state});

/* this method is for the health component
@param {int} health health of the entity
*/
const CHealth = (health) => ({name: "CHealth", health});

/* this method is for the bounding box component
@param {array} size size of the entity
@param {array} halfSize half size of the entity
*/
const CBoundingBox = (size, halfSize) => ({name: "CBoundingBox", size, halfSize});

/* this method is for the input component
@param {bool} up up of the entity
@param {bool} down down of the entity
@param {bool} left left of the entity
@param {bool} right right of the entity
@param {bool} shoot shoot of the entity
@param {bool} canShoot can shoot of the entity
*/
const CInput = (up, down, left, right, shoot, canShoot) => ({name: "CInput", up, down, left, right, shoot, canShoot});

