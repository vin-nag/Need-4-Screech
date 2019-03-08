class GamePlay {
    constructor(){
        this.paused = false
        this.entities = [
            {
                componentMap: {
                    "CAnimation": {
                        "animName": "stand64",
                        "currentFrame": 0,
                        "numOfFrames": 1
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
    }
}

export default GamePlay