import canvasService from "../services/canvas"

const engine = (menuItems) => {
    const canvas = document.getElementById("menuCanvas")
    const ctx = canvas.getContext("2d")
    
    canvasService.draw.rectangle(ctx, 0, 0, canvas.width, canvas.height, "#ed9025")

    const menuVerticalPadding = 100
    const menuItemHeight = (canvas.height-2*menuVerticalPadding)/menuItems.length

    for(let i = 0; i < menuItems.length; i++){
        const x = canvas.width/2
        const y = i*menuItemHeight + menuVerticalPadding
        canvasService.draw.text(ctx, menuItems[i], x, y, "48px", "#fff")
    }
}
export default engine