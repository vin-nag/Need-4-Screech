import io from "socket.io-client"
import connectListener from "./connect"
import disconnectListener from "./disconnect"
import app from '../app'
import APP_WINDOW from '../../enums/app_windows'
import gamePlay from '../gamePlay';

export const socket = io()

export const listen = () => {
    socket.on('connect', () => connectListener(socket))
    socket.on('disconnect', () => disconnectListener(socket))
    socket.on('serverMsg',(data) => {
        console.log(data.msg); 
    });

    socket.on('signUpResponse', (data) => {
        if(data.success){
            alert("Sign up successful.");
            app.switchToWindow(APP_WINDOW.GAME_PLAY)
        } else
            alert("Sign up unsuccessful.");
    });
    
    socket.on('signInResponse', (data) => {
        if(data.success){
            app.switchToWindow(APP_WINDOW.GAME_PLAY)
        } else
            alert("Sign in unsuccessul.");
    });

    socket.on('updateGameState', (data) => {
        gamePlay.getEntities(data.gameState[0])

    }) 
        
    
}

export const emit = (eventName, data) => {
    socket.emit(eventName, data)
}

export default {
    listen,
    emit, 
    socket
}