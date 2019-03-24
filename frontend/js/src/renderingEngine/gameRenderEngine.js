import canvasService from "../services/canvas"
import assetManager from "../services/assetManager"

const engine = (entities, canvasID) => {
    const canvas = document.getElementById(canvasID)
    const ctx = canvas.getContext("2d")

    let bg_name = ""
    for (let entity of entities){
        if (entity.tag === "bg-img"){
            bg_name = entity.componentMap["CAnimation"].animName;
        }
    }

    let bg_img = assetManager.getAnimationImage(bg_name);

    ctx.setTransform(1,0,0,1,0,0); //reset the transform matrix as it is cumulative
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg_img, 0, 0, bg_img.width, bg_img.height, 0, 0, canvas.width, canvas.height);

    let camX = 0;
    let camY = 0;
    for (let entity of entities) {
        if (entity.tag === "bg-img"){continue}
        if (entity.tag === "player") {

            let playerPos = entity.componentMap['CTransform'].position;
            //Clamp the camera position to the world bounds while centering the camera around the player
            camX = canvasService.clamp(-playerPos.x + canvas.width/2, -5000, 5000 - canvas.width);
            camY = canvasService.clamp(-playerPos.y + canvas.height/2, 0, 720 - canvas.height);

            // set boundary for camera movement (need to add level end boundary also)
            if (-playerPos.x < -canvas.width/2) {
                ctx.translate( camX, camY ); 
            }
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

        if (entity.tag === "score") {
            if ("CScore" in entity.componentMap) {
                let score = entity.componentMap["CScore"];
                canvasService.draw.text(ctx, "Score: " + score.score, Math.max(transform.position.x, transform.position.x - camX), transform.position.y, "30px", "#fff", "Permanent Marker")
            }
        }

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

    if ("CBoundingBox" in entity.componentMap && entity.componentMap["CBoundingBox"].show === true){
        const bounding = entity.componentMap["CBoundingBox"];
        canvasService.draw.rectangle(ctx, transform.position.x, transform.position.y, bounding.size.x, bounding.size.y, "#ffffff")
    }

    if ("CEnemyAI" in entity.componentMap && entity.componentMap["CEnemyAI"].show === true){
        let enemyAI = entity.componentMap["CEnemyAI"];
        let enemyBounding = entity.componentMap["CBoundingBox"];
        let enemyOffset = {x: transform.position.x + enemyBounding.halfSize.x, y: transform.position.y + enemyBounding.halfSize.y};
        let path = new Path2D();
        //path.arc(transform.position.x, transform.position.y, enemyAI.detection_distance,transform.scale * Math.PI * 0.5,transform.scale * Math.PI * 1.5, false);
        path.moveTo(enemyOffset.x, enemyOffset.y);
        path.lineTo(enemyAI.playerPosition.x, enemyAI.playerPosition.y)
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'yellow';
        ctx.stroke(path);
    }
}


export default engine