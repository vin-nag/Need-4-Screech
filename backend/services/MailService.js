const nodemailer = require('nodemailer');
const UserAuth = require('./UserAuth')

class MailService {

    transporter(recipient, cb) {

        const tempPass = this.generateTempPassword()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'team.need4screech@gmail.com',
              pass: 'Need4Screech!'
            }
        });

        const mailOptions = {
            from: 'team.need4screech@gmail.com',
            to: recipient.email,
            subject: 'Forgot Password',
            text: 'Your new password is ' + tempPass + '. Please navigate to Profile > Change Password to change your password.'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                cb({
                    success: false,
                    errors: ["Error"]
                });
            } else {
                UserAuth.tempPassword(recipient.email, tempPass, cb)
                console.log('Email sent: ' + info.response);
                cb({
                    success: true,
                    errors: []
                });
            }
        });
    }

    generateTempPassword() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        for (let i = 0; i < 15; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}


module.exports = new MailService()

