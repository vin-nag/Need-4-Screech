const nodemailer = require('nodemailer');
const db = require('./db')
const UserAuth = require('./UserAuth')

class MailService {

    transporter(recipient, cb) {
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
            text: 'Your new password is ' + this.tempPassword() + '. Please navigate to Profile > Change Password to change your password.'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}


  

  


module.exports = new MailService()

