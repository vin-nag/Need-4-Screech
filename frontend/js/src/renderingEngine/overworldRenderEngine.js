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

    for(let i = 0; i < menuItems.length; i++){

        const color = (i === selectedItemIndex) ? "#fff" : "#ff0000"

        if (menuItems[i] === "George Street") {
            canvasService.draw.rectangle(ctx, 585, 550, 235, 50, "rgba(0, 0, 0, 0.6)")
            canvasService.draw.text(ctx, menuItems[i], 700, 585, "30px", color, "Permanent Marker")
        }
        else if (menuItems[i] === "Memorial University") {
            canvasService.draw.rectangle(ctx, 240, 165, 320, 50, "rgba(0, 0, 0, 0.6)")
            canvasService.draw.text(ctx, menuItems[i], 400, 200, "30px", color, "Permanent Marker")
        }
        else if (menuItems[i] === "Cape Spear") {
            canvasService.draw.rectangle(ctx, 808, 68, 187, 50, "rgba(0, 0, 0, 0.6)")
            canvasService.draw.text(ctx, menuItems[i], 900, 100, "30px", color, "Permanent Marker")
        }
    }
}

export default engine