import APP_WINDOWS from "../../enums/app_windows"

const windowToElement = {
    [APP_WINDOWS.LOGIN]: "login",
    [APP_WINDOWS.REGISTER]: "signUp",
    [APP_WINDOWS.LEVEL_EDITOR]: "levelEditor"
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
}

export default engine