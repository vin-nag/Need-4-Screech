import canvasService from "../services/canvas"
import assetManager from "../services/assetManager"

const engine = (entities, canvasID) => {
    const canvas = document.getElementById(canvasID)
    const ctx = canvas.getContext("2d")
    let img = assetManager.getAnimationImage("george_background") 
    ctx.setTransform(1,0,0,1,0,0); //reset the transform matrix as it is cumulative
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img,0,0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    let camX = 0
    let camY = 0

    for(let entity of entities) {
        if (entity.tag === "player") {

            let playerPos = entity.componentMap['CTransform'].position;
            //Clamp the camera position to the world bounds while centering the camera around the player
            camX = canvasService.clamp(-playerPos.x + canvas.width/2, -5000, 5000 - canvas.width);
            camY = canvasService.clamp(-playerPos.y + canvas.height/2, 0, 720 - canvas.height);
            console.log(camX);
            // set boundary for camera movement (need to add level end boundary also)
            // -637 is around the midpoint of screen, need this so canvas only starts translating at this point
            // instead of at (0,0)
            if (-playerPos.x < -637) {
                ctx.translate( camX, camY ); 
            }

            /*
            * Notes: some objects e.g. timer move off screen as they are in
            * fixed position, need to move these with viewport later
            */
            
        }
        
        drawEntity(ctx, entity, camX, camY)
    }  
                                         
}

const drawEntity = (ctx, entity, camX=0, camY=0) => {
    const animation = entity.componentMap["CAnimation"]
    const transform = entity.componentMap["CTransform"]
    const img = assetManager.getAnimationImage(animation.animName)
    const currentFrame = Math.floor(animation.currentFrame);
    const frameWidth = img.width / animation.numOfFrames;
    const frameHeight = img.height;

    if (transform.bounding === true){
    const bounding = entity.componentMap["CBoundingBox"]
    canvasService.draw.rectangle(ctx, transform.position.x, transform.position.y, bounding.size.x, bounding.size.y, "#ffffff")
    }

    if ("CHealth" in entity.componentMap && entity.componentMap["CHealth"].show === true){
        let currentHealthPercentage = entity.componentMap["CHealth"].health / entity.componentMap["CHealth"].maxHealth;
        canvasService.draw.rectangle(ctx, transform.position.x - 2, transform.position.y - 10, frameWidth + 4, 8, "#860b08");
        canvasService.draw.rectangle(ctx, transform.position.x, transform.position.y - 8, currentHealthPercentage * frameWidth, 6, "#f43a26")
    }

    // drawing reverse
    if (transform.scale === -1){
        ctx.save();
        ctx.translate(transform.position.x, transform.position.y);  //location on the canvas to draw your sprite, this is important.
        ctx.scale(-1, 1);  //This does your mirroring/flipping
        ctx.drawImage(img, currentFrame*frameWidth, 0, frameWidth, frameHeight, -frameWidth, 0, frameWidth, frameHeight);
        ctx.restore();
    }

    else {
        if (entity.tag === "bar"){

            ctx.drawImage(img, currentFrame*frameWidth, 0, frameWidth, frameHeight, Math.max(transform.position.x, transform.position.x-camX), transform.position.y, frameWidth, frameHeight);

            if ("CBar" in entity.componentMap){
                const values = entity.componentMap["CBar"];
                const state = entity.componentMap["CState"];
                let offsetX = 200;
                let offsetY = 75;
                let currentPercentage = values.value / values.maxValue;
                canvasService.draw.rectangle(ctx, Math.max(transform.position.x + offsetX - 115, transform.position.x + offsetX - 115 - camX), transform.position.y + offsetY - 55, frameWidth - 110, 27, "#000000");
                canvasService.draw.rectangle(ctx, Math.max(transform.position.x + offsetX - 115, transform.position.x + offsetX - 115 - camX), transform.position.y + offsetY - 54, currentPercentage * (frameWidth - 110), 25, values.color);

                canvasService.draw.text(ctx, "Current " + state.state + ": " + values.value, Math.max(transform.position.x + offsetX, transform.position.x + offsetX - camX), transform.position.y + offsetY, "18px", "#fff", "Permanent Marker")
            }

        }
        else {
        ctx.drawImage(img, currentFrame*frameWidth, 0, frameWidth, frameHeight, transform.position.x, transform.position.y, frameWidth, frameHeight)
        }

    }

}


export default engine