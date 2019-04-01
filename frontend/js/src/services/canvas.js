const rectangle = (ctx, x, y, width, height, fill="#000") => {
    ctx.fillStyle = fill
    ctx.fillRect(x, y, width, height)
}

const text = (ctx, text, x, y, size="20px", fill="#000", font="sans-serif", alignment="center") => {
    ctx.font = `${size} "${font}"`
    ctx.fillStyle = fill
    ctx.textAlign = alignment
    ctx.fillText(text, x, y)
}

const button = (ctx, icon, x, y, width, height, iconSize=null, fill="rgba(0, 0, 0, 0.5)", color="#fff") => {
    iconSize = iconSize || Math.floor(width*0.75)+"px"
    rectangle(ctx, x, y, width, height, fill)
    text(ctx, icon, (2*x+width)/2, (2*y+height)/2 + 0.33*parseInt(iconSize), iconSize, color, "FontAwesome")
}

const viewportOffset = (player, canvas) => {
    let camX = 0;
    let camY = 0;

    let playerPos = player.componentMap['CTransform'].position;
    //Clamp the camera position to the world bounds while centering the camera around the player
    camX = clamp(-playerPos.x + canvas.width/2, -5000, 5000 - canvas.width);
    camY = clamp(-playerPos.y + canvas.height/2, 0, 720 - canvas.height);

    return {camX , camY}
}


const clamp = (value, min, max) => {
    if(value < min) return min;
    else if(value > max) return max;
    return value;
}

export default {
    draw: {
        rectangle,
        text,
        button
    },
    calc: {
        viewportOffset
    },
    clamp
}