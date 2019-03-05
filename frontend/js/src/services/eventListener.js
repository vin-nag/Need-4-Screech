import app from "../app"
import APP_WINDOWS from "../../enums/app_windows"
import services from "./services"

export const listen = () => {
    document.getElementById("goToSignup").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.REGISTER))
    document.getElementById("goToLogin").addEventListener("click", () => app.switchToWindow(APP_WINDOWS.LOGIN))    
    document.getElementById("onSignUp").addEventListener("click", () => services.onSignUp())
    document.getElementById("onLogin").addEventListener("click", () => services.onLogin())
    document.addEventListener("keydown", (event) => services.onKeyDown(event))
    document.addEventListener("keyup", (event) => services.onKeyUp(event))
}

export default {
    listen
}