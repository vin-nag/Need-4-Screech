import app from "../app"
import APP_WINDOWS from "../../enums/app_windows"

const goToMenu = (menu) => {
    menuState.activeMenu = menu
}

const getMenuState = () => {
    return {..._menuState} //Using the `...` spread copies the object into a new one
}

/**
 * Gets the children items for the active menu
 */
const getActiveMenuItems = () => {
    const { activeMenu } = _menuState
    
    if(activeMenu === "Main"){
        //Return the main menu items
        return ["Campaign", "Multiplayer", "Profile", "Level Editor", "Settings", "Instructions"]
    }

    //Return the children of the active menu
    return _menuOptions[activeMenu].children
}

const _menuOptions = {
    "Campaign": {handler: () => app.switchToWindow(APP_WINDOWS.OVERWORLD), children: []},
    "Multiplayer": {handler: () => goToMenu("Multiplayer"), children: ["Host Session", "Join Session"]},
    "Profile": {handler: () => goToMenu("Profile"), children: ["Change Username", "Change Password"]},
    "Level Editor": {handler: () => app.switchToWindow(APP_WINDOWS.LEVEL_EDITOR), children: []},
    "Settings": {handler: () => openSettings(), children: []},
    "Instructions": {handler: () => openInstructions(), children: []},
    "Host Session": {handler: () => openHostSession(), children: []},
    "Join Session": {handler: () => openJoinSession(), children: []},
    "Change Username": {handler: () => openChangeUsername(), children: []},
    "Change Password": {handler: () => openChangePassword(), children: []}
}

const _menuState = {
    activeMenu: "Main"
}

export default {
    goToMenu,
    getMenuState,
    getActiveMenuItems
}