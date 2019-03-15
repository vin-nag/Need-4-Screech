class AssetManager{
    constructor(){
        this.animationImages = {}
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
}

const assetManager = new AssetManager()
export default assetManager