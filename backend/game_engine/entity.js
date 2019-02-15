/**
 * Entity class using standard ECS architecture.
 */
class Entity {
    /**
     * @param {string} tag type of entity needed to group entities together.
     * @param {int} id unique number representing this entity.
     */
    constructor(id, tag=null) {
        this.id = id;
        this.tag = tag;
        this.active = true;
        this.componentMap = new Map();
    }

    addComponent(name, component) {
        /** this function adds componenets. throws an error if entity already has component
         * @param {string} name name of the component
         * @param {object} component component object
         * */
        if (this.componentMap.prototype.has(name)){
            throw new Error(`Entity@addComponent: Component "${name}" already present in entity "${this.id}"`)
        }
        this.componentMap.set(name, component);
    }

    getComponent(name){
        /** this function returns a component by its name.
         * @param {string} name name of the component to get
         * */
        if (this.componentMap.prototype.has(name)){
            return this.componentMap.prototype.get(name)
        }
        throw new Error(`Entity@getComponent: Component "${name}" not found in entity "${this.id}"`)
    }

    removeComponent(name){
        /** this function removes a component by its name.
         * @param {string} name name of the component to remove
         * */
        if (this.componentMap.prototype.has(name)){
            this.componentMap.prototype.delete(name);
        }
        throw new Error(`Entity@removeComponent: Component "${name}" not found in entity "${this.id}"`)
    }

    destroy() {
        // this function marks an entity inactive to be removed by entity manager later
        this.active = false;
    }

    getTag() {
        // standard getter function
        return this.tag;
    }

    getId() {
        // standard getter function
        return this.id;
    }

    isActive(){
        // standard getter function
        return this.active;
    }

}
