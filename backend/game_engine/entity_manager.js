/**
 * Entity Manager class using standard ECS architecture.
 */

const entity_file = require("./entity");
const Entity = new entity_file();

class EntityManager {

    constructor() {
        this.id = 0;
        this.entitiesMap = {};
        this.entitiesToAddMap = {};
        this.size = 0;
    }

    addEntity(tag=null){
        /** this function adds entities.
         * @param {string} tag type of the component
         * */

        console.log('entity:',Entity);
        let entity = new Entity.constructor(this.id, tag);
        this.id++;

        this.entitiesToAddMap[entity.id] = entity;

        return entity;
    }

    removeInactiveEntities(){
        /** this function removes inactive entities.
         * @param {string} tag type of the component
         * */

        for (var entity in this.entitiesMap) {
            if (entity.active === false) {
                delete this.entitiesMap[entity];
            }
        }
    }

    getEntities(){
        // standard getter function
        return this.entitiesMap;
    }

    update(){
        /** this function does an update, adding entities and removing them.
         * */

        // add entities to entity map
        for (var entity in this.entitiesToAddMap) {

            if (entity.id in this.entitiesMap){
                this.id++;
                console.log('entities are overlapping');
                entity.id = this.id;
            }
            this.entitiesMap[entity.id] = entity;
        }

        // clear entitiesToAddMap
        this.entitiesToAddMap = {};

        // remove inactive entities
        this.removeInactiveEntities();

        // update size
        this.size = Object.keys(this.entitiesMap).length;
    }

    getSize(){
        // standard getter function
        return this.size;
    }


}
module.exports =  EntityManager;