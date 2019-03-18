import APP_WINDOWS from "../enums/app_windows"
import socketClient from "./socketClient"
import mainRenderingEngine from "./renderingEngine/mainEngine"
import eventListener from "./services/eventListener"
import levelEditor from "./levelEditor"
import { frontendApp as config } from "../../../config"

class App {
    constructor(){
        this.updateRate = config.updateRate
        this.state = {
            activeWindow: APP_WINDOWS.LOGIN
        }
    }

    switchToWindow(newWindow){
        const lastWindow = this.state.activeWindow

        //Trigger window switch handlers as necessary
        if(lastWindow === APP_WINDOWS.LEVEL_EDITOR && newWindow !== APP_WINDOWS.LEVEL_EDITOR){
            levelEditor.stop()
        }
        else if(lastWindow !== APP_WINDOWS.LEVEL_EDITOR && newWindow === APP_WINDOWS.LEVEL_EDITOR){
            levelEditor.newSessionId()
            levelEditor.run()
        }

        //Set the new active window
        this.state.activeWindow = newWindow
    }

    getActiveWindow(){
        return this.state.activeWindow
    }

    run(){
        socketClient.listen()
        eventListener.listen()
        socketClient.emit("getAnimationsList", {})
        setInterval(() => mainRenderingEngine(this.state.activeWindow), this.updateRate)
    }
}

export const app = new App()
export default app