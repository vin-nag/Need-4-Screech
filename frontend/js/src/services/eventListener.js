import app from "../app"
import APP_WINDOWS from "../../enums/app_windows"
import services from "./services"
import menuService from "./menu"
import levelEditor from "../levelEditor"
import gamePlay from "../gamePlay";

export const listen = () => {
    document.getElementById("goToSignup").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.REGISTER))
    document.getElementById("goToLogin").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.LOGIN))
    document.getElementById("goToMenu").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.MENU)) 
    document.getElementById("goToLevelEditor").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.LEVEL_EDITOR))   
    document.getElementById("onSignUp").addEventListener("click", () => services.onSignUp())
    document.getElementById("onLogin").addEventListener("click", () => services.onLogin())

    document.getElementById("levelEditorLoadLevel").addEventListener("click", () =>levelEditor.loadLevel())
    document.getElementById("levelEditorSaveLevel").addEventListener("click", ()=> levelEditor.saveLevel())
    document.getElementById("levelEditorSetActive").addEventListener("click", () => levelEditor.setActive())

    document.getElementById("levelEditorCanvas").addEventListener("click", (e) => levelEditor.handleClick(e))
    document.getElementById("levelEditorCanvas").addEventListener("mousemove", (e) => levelEditor.handleMouseMove(e))
    document.addEventListener("wheel", (e) => {
        if(app.getActiveWindow() === APP_WINDOWS.LEVEL_EDITOR){ levelEditor.handleMouseWheel(e) }
    })
    document.addEventListener("keypress", (e) => {
        if(app.getActiveWindow() === APP_WINDOWS.LEVEL_EDITOR){ levelEditor.handleKeyPress(e) }
        
    })
    document.addEventListener("keydown", (event) => {
        if(app.getActiveWindow() === APP_WINDOWS.MENU){ menuService.handleKeyPress(event) }
        else if (app.getActiveWindow() === APP_WINDOWS.GAME_PLAY){ gamePlay.handleKeyPress(event) }
    })
    document.addEventListener("keyup", (e) => {
        if (app.getActiveWindow() === APP_WINDOWS.GAME_PLAY){ gamePlay.handleKeyPress(e) }
    })
    
}

export default {
    listen
}