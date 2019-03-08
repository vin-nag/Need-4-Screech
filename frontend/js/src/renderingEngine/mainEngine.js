import APP_WINDOWS from "../../enums/app_windows"

import gameRenderEngine from "./gameRenderEngine"
import menuRenderEngine from "./menuRenderEngine"

import levelEditor from "../levelEditor"
import menuService from "../services/menu"

const windowToElement = {
    [APP_WINDOWS.LOGIN]: "login",
    [APP_WINDOWS.REGISTER]: "signUp",
    [APP_WINDOWS.LEVEL_EDITOR]: "levelEditor",
    [APP_WINDOWS.MENU]: "menu"
}

const engine = (activeWindow) => {
    for(let window of Object.values(APP_WINDOWS)){
        const element = windowToElement[window]
        if(window == activeWindow){
             document.getElementById(element).style.display = "initial" 
        }
        else{
            document.getElementById(element).style.display = "none"
        }
    }

    delegateRendering(activeWindow)
}

const delegateRendering = (activeWindow) => {
    if(activeWindow === APP_WINDOWS.LEVEL_EDITOR){
        gameRenderEngine(levelEditor.entities)
    }
    else if(activeWindow === APP_WINDOWS.MENU){
        menuRenderEngine(menuService.getActiveMenuItems())
    }
}

export default engine