import { socket } from "../socketClient";

class LevelEditor {
    constructor(){
        this.paused = false
        this.entities = [
            {
                componentMap: {
                    "CAnimation": {
                        "animName": "coin",
                        "currentFrame": 0,
                        "numOfFrames": 10
                    },
                    "CTransform": {
                        position: {
                            x: 100,
                            y: 100
                        }
                    }
                }
            }
        ]
        this.selectedEntity = null
    }

    saveLevel(levelName){
        //Stub: Sends the entities array to the backend, in order to
        //save the level, and awaits confirmation
        socket.emit("saveLevel", {
            "name": levelName,
            "entities": this.entities
        })
    }

    loadLevel(levelName){
        //Stub: Calls the backend to request the entities stored for
        //the given level. On success, updates the local gameState
        //accordingly. On failure, displays the corresponding error message
        socket.emit('loadLevel', levelName)


    }

    handleClick(event){
        //Stub: Figures out whether an entity as already selected or not.
        //If yes, deselects the entity. If not, checks if an entity is located
        //at the click pos, and if so sets it as selected
    }

    handleMouseMove(event){
        //Stub: If there is an entity selected, updates its position to that of
        //the cursor
    }

    handleMouseWheel(event){
        //Stub: Map scroll wheel movement to level editor functions (likely changing
        //the animation of the selected entity)
    }

    handleKeyPress(event){
        //Stub: Map key presses to level editor functions
    }

    setEntities(loadedEntites){
        this.entities = loadedEntites
    }

}

export default LevelEditor
