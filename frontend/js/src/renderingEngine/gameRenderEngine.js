import canvasService from "../services/canvas"

const engine = (entities) => {
    const canvas = document.getElementById("levelEditorCanvas")
    const ctx = canvas.getContext("2d")
    
    canvasService.draw.rectangle(ctx, 0, 0, canvas.width, canvas.height, "#42adf4")
    
    for(let entity of entities){ drawEntity(ctx, entity) }
}

const drawEntity = (ctx, entity) => {
    const animation = entity.componentMap["CAnimation"]
    const transform = entity.componentMap["CTransform"]

    const img = new Image()
    img.src = `assets/animations/${animation.animName}.png`

    img.onload = () => {
        const currentFrame = Math.floor(animation.currentFrame)
        const frameWidth = img.width / animation.numOfFrames
        const frameHeight = img.height
        ctx.drawImage(img, currentFrame*frameWidth, 0, frameWidth, frameHeight, transform.position.x, transform.position.y, frameWidth, frameHeight)
    }
}

export default engine