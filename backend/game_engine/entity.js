/**
 * Entity class using standard ECS architecture.
 */
class Entity {
    /**
     * @param {tag} tag type of entity needed to group entities together.
     * @param {id} id of this entity for entiry manager.
     */
    constructor(tag, id) {
        this.tag = name;
        this.id = id;
        this.active = true;
        this.componentArray = [];
    }

    addComponent(component) {
        /** this function adds componenets. throws an error if entity already has component
         * @param {component}
         * */
        if (this.hasComponent(component)){
            new Error(["component already exists"])
        }

        this.componentArray.push(component);
    }

    /** @const @private {!Foo} A short bit of JSDoc. */
    hasComponent(component){
        if (this.componentArray.includes(component)) {
            return true
        }

        return false

    }

    removeComponent(component){

        if (this.hasComponent(component)){
            this.componentArray = this.componentArray.filter(item => item !== component);
        }

    }

    destroy() {
        /** This function marks an entity inactive to be removed by entity manager late*/
        this.active = false;
    }

    getTag() {
        return this.tag;
    }

    getId() {
        return this.id;
    }

    isActive(){
        return this.active;
    }

    getComponent(component){

        if (this.hasComponent(component)){
            return this.componentArray.find(component)
        }

        new Error(["component not in array"]);

    }
}