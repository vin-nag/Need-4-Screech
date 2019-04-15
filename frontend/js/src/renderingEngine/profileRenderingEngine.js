import canvasService from "../services/canvas"

const engine = () => {
    const canvas = document.getElementById("profileCanvas")
    const ctx = canvas.getContext("2d")

    canvasService.draw.rectangle(ctx, 0, 0, canvas.width, canvas.height, "#ed9025")

    const menuVerticalPadding = 50

}

export default engine