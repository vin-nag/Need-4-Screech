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

export default {
    draw: {
        rectangle,
        text
    }
}