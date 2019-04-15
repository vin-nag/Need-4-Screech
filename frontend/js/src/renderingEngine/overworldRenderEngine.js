import canvasService from "../services/canvas"
import assetManager from "../services/assetManager"

const engine = (menuItems, selectedItemIndex) => {
    const canvas = document.getElementById("overworldCanvas")
    const ctx = canvas.getContext("2d")

    let bg_name = "overworld"
    let title = "Need-4-Screech"
    let bg_img = assetManager.getAnimationImage(bg_name);
    let title_img = assetManager.getAnimationImage(title);
    const sub_title_color = "#000"

    ctx.setTransform(1,0,0,1,0,0); //reset the transform matrix as it is cumulative
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg_img, 0, 0, bg_img.width, bg_img.height, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(title_img, 0, 0, title_img.width, title_img.height, 480, 10, 360, 110);
    canvasService.draw.text(ctx, "Overworld", 650, 133, "40px", sub_title_color, "Permanent Marker")

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
            canvasService.draw.rectangle(ctx, 960, 125, 187, 50, "rgba(0, 0, 0, 0.6)")
            canvasService.draw.text(ctx, menuItems[i], 1050, 160, "30px", color, "Permanent Marker")
        }
        else if (menuItems[i] === "Boss Level") {
            canvasService.draw.rectangle(ctx, 1070, 660, 175, 50, "rgba(0, 0, 0, 0.6)")
            canvasService.draw.text(ctx, menuItems[i], 1160, 695, "30px", color, "Permanent Marker")
        }

    }
}

export default engine