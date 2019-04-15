const MailService = require('../../services/MailService')

const onForgot = (socket, data) => {
    MailService.transporter(data, function(res) {
        if(!res.success) {
            socket.emit('forgotResponse',{
                success:false,
                errors: res.errors
            })
        }
        else {
            socket.emit('forgotResponse',{
                success: true
            })
        }
    });
}

module.exports = {
    onForgot
}