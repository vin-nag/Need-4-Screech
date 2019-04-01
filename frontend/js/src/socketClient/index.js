import io from "socket.io-client"
import connectListener from "./connect"
import disconnectListener from "./disconnect"
import assetsListener from "./assets"
import levelEditor from "../levelEditor"
import app from '../app'
import APP_WINDOW from '../../enums/app_windows'
import gamePlay from '../gamePlay'
import domService from "../services/dom"

export const socket = io()

export const listen = () => {
    socket.on("animationsList", (data) => assetsListener.onAnimationsList(socket, data))
    socket.on("musicList", (data) => assetsListener.onMusicList(socket, data))
    socket.on('connect', () => connectListener(socket))
    socket.on('disconnect', () => disconnectListener(socket))
    socket.on('serverMsg',(data) => {
        console.log(data.msg); 
    });

    // ****************************** Registration Listeners ******************************

    // Sign-up listener

    socket.on('signUpResponse', (data) => {
        if(data.success){
            app.switchToWindow(APP_WINDOW.MENU)
        } 
        else{
            let errMsg = ""
            for (let i in data.errors){
                errMsg += data.errors[i] + " \n"
            }
            alert(errMsg)
        }
    });
    
    // Login listener

    socket.on('signInResponse', (data) => {
        if(data.success){
            app.switchToWindow(APP_WINDOW.MENU)
        } 
        else{
            alert(data.errors[0]);
        }
    });



    // ****************************** Level Editor Listeners ******************************
    
    // Save Level Listener

    socket.on('saveLevelResponse', function(data){
        if(data.success){
            alert("Level saved successfully.")
            domService.hideElement("saveLevelModal")
            document.getElementById("saveLevelName").value = ""
        }
        else{
            alert(data.errors.reduce((string, error) => string + `\n${error}`, ""))
        }
    })

    // List Levels Listener
    socket.on("listLevelsResponse", (data) => {
        if(data.success){
            const values = data.levels.map(level => level._id)
            const labels = data.levels.map(level => level.levelName)
            domService.fillSelect("loadLevelsList", values, labels)
        }
        else {
            alert(data.errors.reduce((string, error) => string + `\n${error}`, ""))
        }
    })


    // Load level Listener

    socket.on('loadLevelResponse', function(data){
        if(data.success){
            alert("Level Loaded Successfully.")
            domService.hideElement("loadLevelModal")
        }
        else{
            alert(data.errors[0])
        }

    })

    socket.on('updateGameState', (data) => {
        if(gamePlay.sessionID === data.sessionId) { gamePlay.setEntities(data.gameState) }
        else if(levelEditor.sessionId === data.sessionId) { levelEditor.setEntities(data.gameState) }
    })

    socket.on('newSessionID', (data) => {
        if(data.issuer === "LEVEL_EDITOR"){
            levelEditor.setSession(data.session)
        }
        else{
            gamePlay.setSession(data.session)
        }
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