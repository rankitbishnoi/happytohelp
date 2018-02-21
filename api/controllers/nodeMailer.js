const nodemailer = require('nodemailer');

var mongoose = require('mongoose');
var User = mongoose.model('User');


const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'xxxxxxxxxxxxxxxx@gmail.com', // put your own Id here
        pass: 'myGmailPassword',             // put the password here
    },
});

var Administrators = [];

var fetchAdmins = () => {                    // to fetch the emailids of all the admins
     User.find({'batch': 'Admin'}, (err, admins) => {
          if (err) {
               console.log('Can not fetch the Mobile Number of admins to notify. Error = '+err);
          };
          admins.forEach((admin) => {
               Administrators.push(admin.email);
          });
     });
}

var sendEmail = (to, message) =>{            // function to send the emails
    const mailOptions = {
        from: 'xxxxxxxxxxx@gmail.com',            // put your own id here
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

module.exports.mail = (reciever, msg) => {             //function to recieve all the Notification sendind calls from other controllers
     if (reciever === 'Admin') {
          fetchAdmins();
          Administrators.forEach((email) => {
               sendSms(email, msg);
          });
     }else {
          sendEmail(reciever, msg);
     }
}
