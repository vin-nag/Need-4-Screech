import APP_WINDOWS from "../../enums/app_windows"
import gameRenderEngine from "./gameRenderEngine"
import menuRenderEngine from "./menuRenderEngine"
import overworldRenderEngine from "./overworldRenderEngine";
import instructionsRenderingEngine from "./instructionsRenderingEngine"

import levelEditor from "../levelEditor"
import gamePlay from '../gamePlay'
import menuService from "../services/menu"
import overworldService from "../services/overworld"
import assetManager from "../services/assetManager"
import profileService from "../services/profile"


const windowToElement = {
    [APP_WINDOWS.LOGIN]: "login",
    [APP_WINDOWS.REGISTER]: "signUp",
    [APP_WINDOWS.LEVEL_EDITOR]: "levelEditor",
    [APP_WINDOWS.MENU]: "menu",
    [APP_WINDOWS.PROFILE]: "profile",
    [APP_WINDOWS.GAME_PLAY]: "gamePlay",
    [APP_WINDOWS.OVERWORLD]: "overworld",
    [APP_WINDOWS.INSTRUCTIONS]: "instructions",
    [APP_WINDOWS.FORGOT]: "forgot",
    [APP_WINDOWS.PROFILE]: "profile"
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
    delegateMusic(activeWindow)
}

const delegateRendering = (activeWindow) => {

    if(activeWindow === APP_WINDOWS.LEVEL_EDITOR){
        gameRenderEngine(levelEditor.entities, gamePlay.sfx, "levelEditorCanvas")
    }
    else if(activeWindow === APP_WINDOWS.GAME_PLAY){
        gameRenderEngine(gamePlay.entities, gamePlay.sfx, "gamePlayCanvas")
        const player = gamePlay.entities.find(entity => entity.tag === "player")
        let level_state = player.componentMap['CLevelState'].level_state;
        gamePlay.showModal(level_state);
    }
    else if(activeWindow === APP_WINDOWS.MENU){
        menuRenderEngine(menuService.getActiveMenuItems(), menuService.getSelectedItemIndex())
    }
    else if(activeWindow === APP_WINDOWS.OVERWORLD){
        overworldRenderEngine(overworldService.getActiveMenuItems(), overworldService.getSelectedItemIndex())
    }
    else if(activeWindow === APP_WINDOWS.INSTRUCTIONS){
        instructionsRenderingEngine()
    }
    else if(activeWindow === APP_WINDOWS.PROFILE){
        profileService.showModal();
    }
}

const delegateMusic = (activeWindow) => {

    const levelEditorMusic = assetManager.getMusic("celtic")
    const gamePlayMusic = assetManager.getMusic("shamroc");
    const menuMusic = assetManager.getMusic("heave");
    const overworldMusic = assetManager.getMusic("allan")
    const musicList = [levelEditorMusic, gamePlayMusic, menuMusic, overworldMusic];

    function _playMusic(musicName){
        for (let music of musicList){
            if (music !== musicName){
                music.pause();
                music.currentTime = 0;
            }
            else {
                music.loop = true;
                music.volume = 0.5;
                music.play();
            }
        }
    }

    if(activeWindow === APP_WINDOWS.LEVEL_EDITOR){
        _playMusic(levelEditorMusic);
    }
    else if(activeWindow === APP_WINDOWS.GAME_PLAY){
        _playMusic(gamePlayMusic);
    }
    else if(activeWindow === APP_WINDOWS.MENU){
        _playMusic(menuMusic);
    }
    else if(activeWindow === APP_WINDOWS.OVERWORLD){
        _playMusic(overworldMusic);
    }
}

export default engine