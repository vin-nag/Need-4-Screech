import canvasService from "../services/canvas"

const engine = (entities) => {
    const canvas = document.getElementById("levelEditorCanvas")
    const ctx = canvas.getContext("2d")
    canvasService.draw.rectangle(ctx, 0, 0, canvas.width, canvas.height, "#42adf4")
}

export default engine