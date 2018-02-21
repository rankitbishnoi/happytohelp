var accountSid = 'ACf55cd54d7854ecac3fd089471f585310'; // Your Account SID from www.twilio.com/console
var authToken = 'your_auth_token';   // Your Auth Token from www.twilio.com/console


var mongoose = require('mongoose');
var User = mongoose.model('User');

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

var Administrators = []; // varibale to add all the mobile numbers of admins

var sendSms = (mobileNumber, msg) => {
     client.messages.create({
          body: msg,
          to: mobileNumber,  // Text this number
          from: '+12345678901' // From a valid Twilio number
     })
     .then((message) => console.log(message.sid));
}

var fetchAdmins = () => {         // fucntion to add all the mobile numbers of admins
     User.find({'batch': 'Admin'}, (err, admins) => {
          if (err) {
               console.log('Can not fetch the Mobile Number of admins to notify. Error = '+err);
          };
          admins.forEach((admin) => {
               Administrators.push(admin.mobileNumber.toString());
          });
     });
}

var fetchUserAndSendSms = (emailId, msg) => {             //function to fetch the mobile number of the user and send him the sms
     User.findOne({'email': emailId}, (err, user) => {
          if (err) {
               console.log('Can not fetch the Mobile Number of User to notify. Error = '+err);
          };
          var number = user.mobileNumber.toString();
          sendSms(number, msg);
     })
}

module.exports.notify = (reciever, msg) => {             // function which would be called by other files to send sms using twilio
     if (reciever === 'Admin') {
          fetchAdmins();
          Administrators.forEach((number) => {
               sendSms(number, msg);
          });
     }else {
          fetchUserAndSendSms(reciever, msg);
     }
}
