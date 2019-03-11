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
    if(event.keyCode == 65) {
        // a pressed
        socketClient.emit('onKeyDown', {
            keyDown: 65
        })
    }
    if(event.keyCode == 83) {
        // s pressed
        socketClient.emit('onKeyDown', {
            keyDown: 83
        })
    }
    if(event.keyCode == 68) {
        // d pressed
        socketClient.emit('onKeyDown', {
            keyDown: 68
        })
    }
    if(event.charCode == 32) {
        // space pressed
        socketClient.emit('onKeyDown', {
            keyDown: 32
        })
    }
   
}

export const onKeyUp = (event) => {

    if(event.keyCode == 87) {
        // w up
        socketClient.emit('onKeyUp', {
            keyUp: 87
        })
    }
    if(event.keyCode == 65) {
        // a up
        socketClient.emit('onKeyUp', {
            keyUp: 65
        })
    }
    if(event.keyCode == 83) {
        // s up
        socketClient.emit('onKeyUp', {
            keyUp: 83
        })
    }
    if(event.keyCode == 68) {
        // d up
        socketClient.emit('onKeyUp', {
            keyUp: 68
        })
    }
    if(event.keyCode == 32) {
        // space up
        socketClient.emit('onKeyUp', {
            keyDown: 32
        })
    }
    
   
   
}


export default {
	onSignUp,
    onLogin,
    onKeyDown, 
    onKeyUp
}