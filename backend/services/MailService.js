const nodemailer = require('nodemailer');

class MailService {

    transporter() {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'team.need4screech@gmail.com',
              pass: 'Need4Screech!'
            }
        });

        const mailOptions = {
            from: 'team.need4screech@gmail.com',
            to: 'liamreardon14@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
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

