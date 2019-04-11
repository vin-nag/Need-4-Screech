class AssetManager{
    constructor(){
        this.animationImages = {}
        this.musicObjects = {}
        this.soundObjects = {}
    }

    loadAnimationImages(animationNames){
        for(let animationName of animationNames){
            const img = new Image()
            img.src = `assets/animations/${animationName}.png`

            this.animationImages[animationName] = img
        }
    }

    getAnimationImage(animationName){
        return this.animationImages[animationName]
    }

    loadMusic(musicNames){
        for(let musicName of musicNames){
            const music = new Audio(`assets/music/${musicName}.mp3`)
            this.musicObjects[musicName] = music;
        }
    }

    loadSfx(soundNames){
        for(let soundName of soundNames){
            const sound = new Audio(`assets/sfx/${soundName}.wav`)
            this.soundObjects[soundName] = sound;
        }
    }

    getMusic(musicName){
        return this.musicObjects[musicName]
    }

    getSound(soundName){
        return this.soundObjects[soundName]
    }
}

const assetManager = new AssetManager()
export default assetManager