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
const CHealth = (health, maxHealth, invincible=false, show=false) => ({name: "CHealth", health, maxHealth, invincible, show});

/* this method is for the bounding box component
@param {array} size size of the entity
@param {array} halfSize half size of the entity
*/
const CBoundingBox = (size, halfSize, show=false) => ({name: "CBoundingBox", size, halfSize, show});

/* this method is for the input component
@param {bool} up up of the entity
@param {bool} down down of the entity
@param {bool} left left of the entity
@param {bool} right right of the entity
@param {bool} shoot shoot of the entity
@param {bool} canShoot can shoot of the entity
*/
const CInput = (up, down, left, right, shoot, canShoot, canScreech, canDrink) => ({name: "CInput", up, down, left, right, shoot, canShoot, canScreech, canDrink});

/**
 * @param {string} animName The name of the animation file (should be located in the assets/animations folder)
 * @param {int} numOfFrames The number of frames contained within the animation
 * @param {float} currentFrame The current frame. Floor this variable to determine which portion of the animation to render.
 * @param {float} speed The number of frames per second to increment `currentFrame` by.
 */
const CAnimation = (animName, numOfFrames, currentFrame, speed) => ({name: "CAnimation", animName, numOfFrames, currentFrame, speed});

/**
 * @param {bool} superSpeed superSpeed powerup of entity
 * @param {bool} invincibility invincibility powerup of entity
 * @param {bool} shield shield powerup of entity
 * @param {bool} drunk drunk powerup of entity
 * 
 */
const CPowerup = (superSpeed, invincibility, shield, drunk) =>({name: "CPowerup", superSpeed, invincibility, shield, drunk});

const CBar = (value, maxValue, color) => ({name: "CBar", value, maxValue, color});

const CEnemyAI = (enemy_type, currentRoam, roamDistance, aggro_time=5000, detection_distance=1000, player_detected=false, show=false, playerPosition, canAttack=true) => ({name: "CEnemyAI", enemy_type, currentRoam, roamDistance, aggro_time, detection_distance, player_detected, show, playerPosition, canAttack});

const CEnemyAnim = (idleAnim, idleAnimFrames, attackAnim, attackAnimFrames, deadAnim, deadAnimFrames) => ({name: "CEnemyAnim", idleAnim, idleAnimFrames, attackAnim, attackAnimFrames, deadAnim, deadAnimFrames})

const CScreech = (screechCount) => ({name: "CScreech", screechCount});

const CScore = (score) => ({name: "CScore", score});

const CGameRunning = (running) => ({name: "CGameRunning", running});

const CAttacker = (attacker) => ({name: "CAttacker", attacker});

const CLevelState = (level_state) => ({name: "CLevelState", level_state})

module.exports = {CLifeSpan, CBoundingBox, CGravity, CHealth, CInput, CState, CTransform, CAnimation, CBar, CPowerup, CEnemyAI, CScreech, CScore, CGameRunning, CEnemyAnim, CAttacker, CLevelState};
