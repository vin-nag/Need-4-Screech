import app from "../app"
import APP_WINDOWS from "../../enums/app_windows"
import services from "./services"
import levelEditor from "../levelEditor"

export const listen = () => {
    document.getElementById("goToSignup").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.REGISTER))
    document.getElementById("goToLogin").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.LOGIN))    
    document.getElementById("onSignUp").addEventListener("click", () => services.onSignUp())
    document.getElementById("onLogin").addEventListener("click", () => services.onLogin())

    document.getElementById("goToLevelEditor").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.LEVEL_EDITOR))
    document.getElementById("levelEditorCanvas").addEventListener("click", (e) => levelEditor.handleClick(e))
    document.getElementById("levelEditorCanvas").addEventListener("mousemove", (e) => levelEditor.handleMouseMove(e))
    document.addEventListener("wheel", (e) => {
        if(app.getActiveWindow() === APP_WINDOWS.LEVEL_EDITOR){ levelEditor.handleMouseWheel(e) }
    })
    document.addEventListener("keypress", (e) => {
        if(app.getActiveWindow() === APP_WINDOWS.LEVEL_EDITOR){ levelEditor.handleKeyPress(e) }
    })

    document.getElementById("goToMenu").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.MENU))
    document.addEventListener("keydown", (event) => services.getInput(event))
}

export default {
    listen
}