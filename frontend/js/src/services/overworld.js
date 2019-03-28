import app from "../app"
import APP_WINDOWS from "../../enums/app_windows"

/**
 * Shows the overworld levels
 * 
 * @param {*} menu The label of the overworld level to be set as active
 */
const goToMenu = (menu) => {
    _menuState.activeMenu = menu
    _menuState.selectedItemIndex = 0
}

/**
 * Gets the children items for the active menu
 */
const getActiveMenuItems = () => {
    const { activeMenu } = _menuState
    
    if(activeMenu === "Main"){
        //Return the overworld levels
        return ["George Street", "Memorial University", "Cape Spear"];
    }

    //Return the children of the active menu
    return _menuOptions[activeMenu].children
}

/**
 * Gets the index of the selected item
 */
const getSelectedItemIndex = () => {
    return _menuState.selectedItemIndex
}

/**
 * Handles key inputs for the menu window
 */
const handleKeyPress = (event) => {
    if(event.keyCode === 38){ _shiftSelectedItemUp() } //Up Arrow Key
    else if(event.keyCode === 40){ _shiftSelectedItemDown() } //Down Arrow Key
    else if(event.keyCode === 13){ _triggerSelectedItem() } //Enter Key
    else if(event.keyCode === 27){ goToMenu("Main") } //Escape Key
}

//--------------Private Variables and Functions------------//

const _shiftSelectedItemDown = () => {
    const numOfItems = getActiveMenuItems().length
    _menuState.selectedItemIndex = (_menuState.selectedItemIndex + 1) % numOfItems
}

const _shiftSelectedItemUp = () => {
    const numOfItems = getActiveMenuItems().length
    _menuState.selectedItemIndex = (_menuState.selectedItemIndex - 1) % numOfItems
}

const _triggerSelectedItem = () => {
    const menuItems = getActiveMenuItems()
    const selectedItem = menuItems[getSelectedItemIndex()]
    _menuOptions[selectedItem].handler() //call the handler of the selected item
}

const _menuOptions = {
    "George Street": {handler: () => app.switchToWindow(APP_WINDOWS.GAME_PLAY), children: []},
    "Memorial University": {handler: () => app.switchToWindow(APP_WINDOWS.GAME_PLAY), children: []},
    "Cape Spear": {handler: () => app.switchToWindow(APP_WINDOWS.GAME_PLAY), children: []},
}

const _menuState = {
    activeMenu: "Main",
    selectedItemIndex: 0
}

export default {
    goToMenu,
    getActiveMenuItems,
    getSelectedItemIndex,
    handleKeyPress
}