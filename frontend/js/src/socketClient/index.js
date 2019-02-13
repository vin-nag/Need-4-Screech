import io from "socket.io-client"
import connectListener from "./connect"
import disconnectListener from "./disconnect"

export const socket = io()

export const listen = () => {
    socket.on('connect', () => connectListener(socket))
    socket.on('disconnect', () => disconnectListener(socket))
    socket.on('serverMsg',(data) => {
        console.log(data.msg); 
    });

    socket.on('signUpResponse',(data) => {
        if(data.success){
            alert("Sign up successful.");
            hideAuth();
        } else
            alert("Sign up unsuccessful.");
    });
    
    socket.on('signInResponse',function(data){
        if(data.success){
            hideAuth();
        } else
            alert("Sign in unsuccessul.");
    });
}

export const emit = (eventName, data) => {
    socket.emit(eventName, data)
}


export default {
    listen,
    emit, 
    socket
}