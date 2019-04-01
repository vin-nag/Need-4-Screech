import APP_WINDOWS from "../../enums/app_windows"
import gameRenderEngine from "./gameRenderEngine"
import menuRenderEngine from "./menuRenderEngine"
import editorRenderEngine from "./editorRenderEngine"
import overworldRenderEngine from "./overworldRenderEngine";
import domService from "../services/dom"

import levelEditor from "../levelEditor"
import gamePlay from '../gamePlay'
import menuService from "../services/menu"
import overworldService from "../services/overworld"

const windowToElement = {
    [APP_WINDOWS.LOGIN]: "login",
    [APP_WINDOWS.REGISTER]: "signUp",
    [APP_WINDOWS.LEVEL_EDITOR]: "levelEditor",
    [APP_WINDOWS.MENU]: "menu",
    [APP_WINDOWS.GAME_PLAY]: "gamePlay",
    [APP_WINDOWS.OVERWORLD]: "overworld"
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
        gameRenderEngine(levelEditor.entities, "levelEditorCanvas")
        editorRenderEngine()
    }
    else if(activeWindow === APP_WINDOWS.GAME_PLAY){
        gameRenderEngine(gamePlay.entities, "gamePlayCanvas")
        for (let entity of gamePlay.entities) {
            if (entity.tag === "player") {
                let level_state = entity.componentMap['CLevelState']
                if (level_state.level_state === "complete") {
                    domService.showElement("completeLevelModal")
                }
                else if (level_state.level_state === "failed") {
                    domService.showElement("failedLevelModal")
                }
            }
        }
    }
    else if(activeWindow === APP_WINDOWS.MENU){
        menuRenderEngine(menuService.getActiveMenuItems(), menuService.getSelectedItemIndex())
    }
    else if(activeWindow === APP_WINDOWS.OVERWORLD){
        overworldRenderEngine(overworldService.getActiveMenuItems(), overworldService.getSelectedItemIndex())
    }
    
}

export default engine