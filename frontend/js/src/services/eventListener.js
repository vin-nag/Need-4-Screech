import app from "../app"
import APP_WINDOWS from "../../enums/app_windows"
import services from "./services"
import menuService from "./menu"
import domService from "./dom"
import levelEditor from "../levelEditor"
import gamePlay from "../gamePlay";
import socketClient from "../socketClient"

export const listen = () => {
    document.getElementById("goToSignup").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.REGISTER))
    document.getElementById("goToLogin").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.LOGIN))
    document.getElementById("onSignUp").addEventListener("click", () => services.onSignUp())
    document.getElementById("onLogin").addEventListener("click", () => services.onLogin())

    document.getElementById("levelEditorLoadLevel").addEventListener("click", () => {
        domService.showElement("loadLevelModal")
        socketClient.emit("listLevels", {})
    })
    document.getElementById("levelEditorSaveLevel").addEventListener("click", ()=> domService.showElement("saveLevelModal"))
    document.getElementById("levelEditorSetActive").addEventListener("click", () => levelEditor.changeEntityType())

    document.getElementById("levelEditorCanvas").addEventListener("click", (e) => levelEditor.handleClick(e))
    document.getElementById("levelEditorCanvas").addEventListener("mousemove", (e) => levelEditor.handleMouseMove(e))

    document.getElementById("saveLevelButton").addEventListener("click", () => {
        const levelName = document.getElementById("saveLevelName").value
        levelEditor.saveLevel(levelName)
    })
    document.getElementById("loadLevelButton").addEventListener("click", () => {
        const levelId = document.getElementById("loadLevelsList").value
        levelEditor.loadLevel(levelId)
    })

    document.addEventListener("wheel", (e) => {
        if(app.getActiveWindow() === APP_WINDOWS.LEVEL_EDITOR){ levelEditor.handleMouseWheel(e) }
    })
    
    document.addEventListener("keydown", (event) => {
        if(app.getActiveWindow() === APP_WINDOWS.MENU){ menuService.handleKeyPress(event) }
        else if (app.getActiveWindow() === APP_WINDOWS.GAME_PLAY){ gamePlay.handleKeyPress(event) }
        else if(app.getActiveWindow() === APP_WINDOWS.LEVEL_EDITOR){ levelEditor.handleKeyPress(event) } 

        if(event.keyCode === 27 && ![APP_WINDOWS.LOGIN, APP_WINDOWS.REGISTER, APP_WINDOWS.MENU].includes(app.getActiveWindow())){ //Escape
            app.switchToWindow(APP_WINDOWS.MENU)
        }
    })
    document.addEventListener("keyup", (e) => {
        if (app.getActiveWindow() === APP_WINDOWS.GAME_PLAY){ gamePlay.handleKeyPress(e) }
        else if(app.getActiveWindow() === APP_WINDOWS.LEVEL_EDITOR){ levelEditor.handleKeyPress(e) } 
    })
    
}

export default {
    listen
}