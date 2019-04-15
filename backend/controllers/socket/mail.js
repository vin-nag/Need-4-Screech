const MailService = require('../../services/MathService')

const onForgot = (socket, data) => {
    MailService.transporter(data, function(res) {
        if(!res.success) {
            socket.emit('signInResponse',{
                success:false,
                errors: res.errors
            })
        }
        else {
            socket.emit('signInResponse',{
                success:true
            })
        }
    });
}

module.exports = {
    onForgot
}