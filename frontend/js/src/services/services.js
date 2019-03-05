import socketClient from "../socketClient"

// emitters
export const onSignUp = () => {
    socketClient.emit('onSignUp',{

        username: document.getElementById('signUpUsername').value,
        email: document.getElementById('signUpEmail').value,
        password: document.getElementById('signUpPassword').value,
        confirmPass: document.getElementById('signUpConfirm').value

    });
}

export const onLogin = () => {
    socketClient.emit('onLogin',{
        
        username: document.getElementById('loginUsername').value,
        password: document.getElementById('loginPassword').value

    });
}

export const onKeyDown = (event) => {

    if(event.keyCode == 87) {
        // w pressed
        socketClient.emit('onKeyDown', {
            keyDown: 87
        })
    }
    else if(event.keyCode == 65) {
        // a pressed
        socketClient.emit('onKeyDown', {
            keyDown: 65
        })
    }
    else if(event.keyCode == 83) {
        // s pressed
        socketClient.emit('onKeyDown', {
            keyDown: 83
        })
    }
    else if(event.keyCode == 68) {
        // d pressed
        socketClient.emit('onKeyDown', {
            keyDown: 68
        })
    }
   
}

export const onKeyUp = (event) => {

    if(event.keyCode == 87) {
        // w pressed
        socketClient.emit('onKeyUp', {
            keyUp: 87
        })
    }
    else if(event.keyCode == 65) {
        // a pressed
        socketClient.emit('onKeyUp', {
            keyUp: 65
        })
    }
    else if(event.keyCode == 83) {
        // s pressed
        socketClient.emit('onKeyUp', {
            keyUp: 83
        })
    }
    else if(event.keyCode == 68) {
        // d pressed
        socketClient.emit('onKeyUp', {
            keyUp: 68
        })
    }
    
   
   
}


export default {
	onSignUp,
    onLogin,
    onKeyDown, 
    onKeyUp
}