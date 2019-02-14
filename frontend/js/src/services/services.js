import socketClient from "../socketClient"

// emitters
window.onSignUp = () => {
    socketClient.emit('onSignUp',{

        username: document.getElementById('signUpUsername').value,
        email: document.getElementById('signUpEmail').value,
        password: document.getElementById('signUpPassword').value,
        confirmPass: document.getElementById('signUpConfirm').value

    });
}

window.onLogin = () => {
    socketClient.emit('onLogin',{
        
        username: document.getElementById('loginUsername').value,
        password: document.getElementById('loginPassword').value

    });
}

export default {
	onSignUp,
	onLogin
}