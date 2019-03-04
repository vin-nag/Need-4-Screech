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

export const getInput = (event) => {

    if(event.keyCode == 87) {
        // w pressed
        socketClient.emit('onInput', {
            keyPressed: 87
        })
    }
    else if(event.keyCode == 65) {
        // a pressed
        socketClient.emit('onInput', {
            keyPressed: 67
        })
    }
    else if(event.keyCode == 83) {
        // s pressed
        socketClient.emit('onInput', {
            keyPressed: 83
        })
    }
    else if(event.keyCode == 68) {
        // d pressed
        socketClient.emit('onInput', {
            keyPressed: 68
        })
    }
   
}


export default {
	onSignUp,
    onLogin,
    getInput
}