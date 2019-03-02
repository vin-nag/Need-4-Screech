const rectangle = (ctx, x, y, width, height, fill="#000") => {
    ctx.fillStyle = fill
    ctx.fillRect(x, y, width, height)
}

export default {
    draw: {
        rectangle
    }
}