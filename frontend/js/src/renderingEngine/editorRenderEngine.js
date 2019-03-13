import canvasService from "../services/canvas"

const engine = () => {
    const canvas = document.getElementById("levelEditorCanvas")
    const ctx = canvas.getContext("2d")
    
    _drawButtons(canvas, ctx)
}

const _drawButtons = (canvas, ctx) => {
    const buttons = ["\uf019", "\uf093", "\uf0ec"]
    const verticalPadding = 100
    const rowHeight = (canvas.height-2*verticalPadding)/buttons.length
    const buttonSize = 50

    for(let i = 0; i < buttons.length; i++){
        const x = canvas.width - buttonSize - 20
        const y = (i)*rowHeight + verticalPadding
        canvasService.draw.button(ctx, buttons[i], x, y, buttonSize, buttonSize)
    }
    
}

export default engine