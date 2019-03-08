class GamePlay {
    constructor(){
        this.paused = false
        this.entities = []
    }

    getEntities(entities) {
        this.entities = entities;
        console.log(this.entities)
    }
}

export default GamePlay