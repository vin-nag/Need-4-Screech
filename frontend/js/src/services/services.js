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

export const onForgot = () => {
    socketClient.emit('onForgot',{
        
        email: document.getElementById('emailForgot').value

    });
}

export default {
	onSignUp,
    onLogin
}