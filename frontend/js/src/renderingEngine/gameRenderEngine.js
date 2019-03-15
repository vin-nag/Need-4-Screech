import canvasService from "../services/canvas"
import assetManager from "../services/assetManager"

const engine = (entities, canvasID) => {
    const canvas = document.getElementById(canvasID)
    const ctx = canvas.getContext("2d")

    console.log(entities)
    
    canvasService.draw.rectangle(ctx, 0, 0, canvas.width, canvas.height, "#42adf4")
    
    for(let entity of entities){ drawEntity(ctx, entity) }
}

const drawEntity = (ctx, entity) => {
    const animation = entity.componentMap["CAnimation"]
    const transform = entity.componentMap["CTransform"]

    /*
    *Uncomment to draw bounding boxes
    const bounding = entity.componentMap["CBoundingBox"]
    */

    const img = assetManager.getAnimationImage(animation.animName)

    const currentFrame = Math.floor(animation.currentFrame)
    const frameWidth = img.width / animation.numOfFrames
    const frameHeight = img.height
    ctx.drawImage(img, currentFrame*frameWidth, 0, frameWidth, frameHeight, transform.position.x, transform.position.y, frameWidth, frameHeight)

    /*
    * Uncomment to draw bounding boxes
    canvasService.draw.rectangle(ctx, transform.position.x, transform.position.y, bounding.size.x, bounding.size.y, "#ffffff")
    */



}

export default engine