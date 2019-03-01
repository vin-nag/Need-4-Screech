import APP_WINDOWS from "../enums/app_windows"
import socketClient from "./socketClient"
import mainRenderingEngine from "./renderingEngine/mainEngine"
import eventListener from "./services/eventListener"
import { frontendApp as config } from "../../../config"

class App {
    constructor(){
        this.updateRate = config.updateRate
        this.state = {
            activeWindow: APP_WINDOWS.LOGIN
        }
    }

    switchToWindow(newWindow){
        this.state.activeWindow = newWindow
    }

    run(){
        socketClient.listen()
        eventListener.listen()
        setInterval(() => mainRenderingEngine(this.state.activeWindow), this.updateRate)
    }
}

export const app = new App()
export default app