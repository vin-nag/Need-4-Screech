import canvasService from "../services/canvas"
import assetManager from "../services/assetManager"

const engine = (menuItems, selectedItemIndex) => {
    const canvas = document.getElementById("overworldCanvas")
    const ctx = canvas.getContext("2d")

    let bg_name = "overworld"
    let bg_img = assetManager.getAnimationImage(bg_name);

    ctx.setTransform(1,0,0,1,0,0); //reset the transform matrix as it is cumulative
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg_img, 0, 0, bg_img.width, bg_img.height, 0, 0, canvas.width, canvas.height);

    const menuVerticalPadding = 100
    const menuItemHeight = (canvas.height-2*menuVerticalPadding)/menuItems.length

    for(let i = 0; i < menuItems.length; i++){
        const x = canvas.width/2
        const y = (i+0.5)*menuItemHeight + menuVerticalPadding
        const color = (i === selectedItemIndex) ? "rgba(255,255,255,0.5)" : "#fff"
        canvasService.draw.text(ctx, menuItems[i], x, y, "30px", color, "Permanent Marker")
    }
}

export default engine