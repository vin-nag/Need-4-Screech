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
    clamp
}