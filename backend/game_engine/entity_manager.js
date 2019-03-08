/**
 * Entity Manager class using standard ECS architecture.
 */

const entity_file = require("./entity");
const Entity = new entity_file();

class EntityManager {
    /*
    This class manages entities
     */
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

        for (let entity of this.entities) {
            //console.log('in remove inactive entities', entity);
            if (entity.active === false) {
                //console.log('reached active === false reached here');
                let index = this.entities.indexOf(entity);
                this.entities.splice(index, 1);
            }
        }
    }

    getEntities(){
        // standard getter function
        return this.entities;
    }

    getEntitiesByTag(tag){
        let returnEntities = [];

        for (let entity of this.entities){
            if (entity.tag === tag){
                returnEntities.push(entity);
            }
        }
        return returnEntities;
    }

    update(){
        /** this function does an update, adding entities and removing them.
         * */

        // add entities to entity map
        for (let entity of this.entitiesToAdd) {
            //console.log('adding entities in update. entity:', entity);

            if (entity.id in this.entities){
                throw new Error(`EntityManager@update: Entity "${entity.id}" already found in this.entities.`);
            }
            //console.log('entity check here:',entity);
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