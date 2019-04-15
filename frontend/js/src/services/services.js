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

export const onChangePassword = () => {
    socketClient.emit('onChangePassword',{
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        newPass: document.getElementById('newPass').value,
        confirmPass: document.getElementById('confirmPass').value
    });
}


export default {
	onSignUp,
    onLogin, 
    onForgot,
    onChangePassword
}