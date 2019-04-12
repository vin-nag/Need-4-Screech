import canvasService from "../services/canvas"

const engine = () => {
    const canvas = document.getElementById("instructionsCanvas")
    const ctx = canvas.getContext("2d")
    
    canvasService.draw.rectangle(ctx, 0, 0, canvas.width, canvas.height, "#ed9025")

    const menuVerticalPadding = 50

    const gameInstructionList = [
        "Gameplay",
        "W - Jump",
        "A - Move Left",
        "D - Move Right",
        "Space - Shoot", 
        "O - Throw Screech",
        "F - Drunk Mode"
    ]

    const editorInstructionList = [
        "Level Editor",
        "G - Show Grid",
        "B - Show Bounding Box",
        "V - Show Enemy Raycast",
        "N - New Entity",
        "Left Arrow - Last Entity",
        "Right Arrow - Next Entity",
        "Delete - Delete Entity"
    ]

    const gameItemHeight = (canvas.height-2*menuVerticalPadding)/gameInstructionList.length
    const editorItemHeight = (canvas.height-2*menuVerticalPadding)/editorInstructionList.length

    for(let i = 0; i < gameInstructionList.length; i++){
        if (gameInstructionList[i] === "Gameplay") {
            const x = 320
            const y = (i+0.5)*gameItemHeight + menuVerticalPadding
            canvasService.draw.text(ctx, gameInstructionList[i], x, y, "35px", "#000", "Permanent Marker")
        }
        else {
            const x = 320
            const y = (i+0.5)*gameItemHeight + menuVerticalPadding
            canvasService.draw.text(ctx, gameInstructionList[i], x, y, "20px", "#fff", "Permanent Marker")
        }

    }

    for(let i = 0; i < editorInstructionList.length; i++){
        if (editorInstructionList[i] === "Level Editor") {
            const x = 960
            const y = (i+0.5)*editorItemHeight + menuVerticalPadding
            canvasService.draw.text(ctx, editorInstructionList[i], x, y, "35px", "#000", "Permanent Marker")
        }
        else {
            const x = 960
            const y = (i+0.5)*editorItemHeight + menuVerticalPadding
            canvasService.draw.text(ctx, editorInstructionList[i], x, y, "20px", "#fff", "Permanent Marker")
        }
    }

}

export default engine