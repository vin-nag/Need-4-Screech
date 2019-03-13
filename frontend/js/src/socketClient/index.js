import io from "socket.io-client"
import connectListener from "./connect"
import disconnectListener from "./disconnect"
import levelEditor from "../levelEditor"
import app from '../app'
import APP_WINDOW from '../../enums/app_windows'
import gamePlay from '../gamePlay'

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
            gamePlay.newSessionId();
            gamePlay.run()
        } else
            alert("Sign up unsuccessful.");
    });
    
    socket.on('signInResponse', (data) => {
        if(data.success){
            app.switchToWindow(APP_WINDOW.GAME_PLAY)
            gamePlay.newSessionId();
            gamePlay.run()
        } else
            alert("Sign in unsuccessul.");
    });

    // ****************************** Level Editor Listeners ******************************
    
    // Save Level Listener

    socket.on('saveLevelResponse', function(data){
        if(data.success){
            alert("Level saved successfully.")
        }
        else{
            alert(data.errors[0])
        }
    })


    // Load level Listener

    socket.on('loadLevelResponse', function(data){
        if(data.success){
            levelEditor.setEntities(data.res.entities)
            alert("Level Loaded Successfully.")
        }
        else{
            alert(data.errors[0])
        }

    })

    socket.on('updateGameState', (data) => {
        gamePlay.setEntities(data.gameState)
    })

    socket.on('newSessionID', (data) => {
        gamePlay.setSession(data.session)
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