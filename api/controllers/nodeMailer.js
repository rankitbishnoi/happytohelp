const nodemailer = require('nodemailer');

var mongoose = require('mongoose');
var User = mongoose.model('User');


const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'xxxxxxxxxxxxxxxx@gmail.com',
        pass: 'myGmailPassword',
    },
});

var Administrators = [];

var fetchAdmins = () => {
     User.find({'batch': 'Admin'}, (err, admins) => {
          if (err) {
               console.log('Can not fetch the Mobile Number of admins to notify. Error = '+err);
          };
          admins.forEach((admin) => {
               Administrators.push(admin.email);
          });
     });
}

var sendEmail = (to, message) =>{
    const mailOptions = {
        from: 'xxxxxxxxxxx@gmail.com',
        to,
        subject: 'Notification',
        html: message,
    };
    transport.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    });
};

module.exports.mail = (reciever, msg) => {
     if (reciever === 'Admin') {
          fetchAdmins();
          Administrators.forEach((email) => {
               sendSms(email, msg);
          });
     }else {
          sendEmail(reciever, msg);
     }
}
