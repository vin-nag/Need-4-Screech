/**
 * Entity Manager class using standard ECS architecture.
 */
const entity_file = require("./entity");
const Entity = new entity_file();


class EntityManager {

    constructor() {
        this.id = 0;
        this.size = 0;
        this.entities = [];
        this.entitiesToAdd = [];
    }

    addEntity(tag=null){
        /** this function adds entities.
         * @param {string} tag type of the component
         * */

        let entity = new Entity.constructor(this.id, tag);
        this.id++;
        this.entitiesToAdd.push(entity);

        return entity

    }

    removeInactiveEntities(){
        /** this function removes inactive entities.
         * @param {string} tag type of the component
         * */

        for (let entity in this.entities) {
            if (entity.active === false) {
                let index = this.entities.indexOf(entity);
                this.entities.splice(index, 1);
            }
        }
    }

    getEntities(){
        // standard getter function
        return this.entities;
    }

    update(){
        /** this function does an update, adding entities and removing them.
         * */

        // add entities to entity map
        for (let entity in this.entitiesToAdd) {

            if (entity.id in this.entities){
                throw new Error(`EntityManager@update: Entity "${entity.id}" already found in this.entities.`);
            }
            this.entities.push(entity);
        }

        // clear entitiesToAddMap
        this.entitiesToAdd = [];

        // remove inactive entities
        this.removeInactiveEntities();

        // update size
        this.size = this.entities.length;
    }

    getSize(){
        // standard getter function
        return this.size;
    }


}
// export the entity manager
module.exports = EntityManager;