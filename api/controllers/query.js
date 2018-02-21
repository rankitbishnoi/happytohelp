var mongoose = require('mongoose');
var Queries = mongoose.model('Query');

// uncomment these two lines if you want to use the twilioSMs and nodemailer email services
//var twilioSms = require('./twilioSms.js')
//var mailer = require('./nodeMailer.js')

var sendJSONresponse = function(res, status, content) {
     res.status(status);
     res.json(content);
};


module.exports.getQueryList = (req, res) => {          // function to give the queries on requests
     var page = parseInt(req.body.page);
     var query = {};
     var cursor;
     if (req.query.count === 'false') {                // filter used to determine that result should be a list of queries
          if (req.query.status != undefined && req.query.status === 'open') {   // filter to determine that the queries should be open
               query.status = true;
          }else if (req.query.status != undefined && req.query.status === 'closed'){   // filter to determine that the queries should be closed
               query.status = false;
          }

          if (req.query.raisedBy === 'true') {             // filter to determine that the queries sent should be created by only the user whose emailid is provided
               query["user.email"] = req.query.email;
          }

          cursor = Queries.find({$and:[query]}).sort({'createdOn':-1}).skip((page*10)).limit(10);
     }else if (req.query.count === 'true'){            // filter to determine that the the count of queries awailable in database should be provided
          if (req.query.total === 'true') {               // filter to decide that the count should be of only queries raised by a particular user
               query["user.email"] = req.query.email;
          }

          if (req.query.resolved === 'true') {             // filter to decide that the count should be of only queries that are resolved/closed
               query.status = false;
          }

          if (req.query.status != undefined && req.query.status === 'open') {         // filter to decide that the count should be of only queries that are not resolved/open
               query.status = true;
          }else if (req.query.status === 'closed'){         // filter to decide that the count should be of only queries that are resolved/closed
               query.status = false;
          }

          if (req.query.raisedBy === 'true') {                // filter to decide that the count should be of only queries raised by a particular user
               query["user.email"] = req.query.email;
          }
          cursor = Queries.count({$and:[query]})
     }

     cursor.exec((err, list) => {
          if(err) {
               sendJSONresponse(res, 400, {
                    "message": "Something is Wrong. We are working it out. Try again."+ err
               });
               return;
          };
          res.status(200);
          res.json(list);
     })
};

module.exports.createQuery = (req, res) => {                  // function to create a query document in database with the data provided when called
     if(req.body.subject === undefined || req.body.description === undefined || req.body.name === undefined || req.body.email === undefined ) {
          sendJSONresponse(res, 400, {
               "message": "All fields required"
          });
          return;
     }

     var query = new Queries({
          subject : req.body.subject,
          status : true,
          content : req.body.description,
          user : { name : req.body.name, email : req.body.email },
          createdOn : Date.now(),
          conversation : []
     });


     query.save((err) => {
          if(err) {
               sendJSONresponse(res, 400, {
                    "message": "Something is Wrong. We are working it out. Try again."+err
               });
               return;
          };
          res.status(200);
          res.json("Request Successfull.");
          // uncomment these if you want to send the notifications by twilio and nodemailer
          //var msg = 'New Query Has been uploaded by '+ query.user.name;
          //twilioSms.notify('Admin', msg);
          //mailer.mail('Admin', msg);
     })
};

module.exports.changeStatus = (req, res) => {                      // function to change the status of the queri=y from open to close and vice-e-versa when called
     Queries.findOne({'_id': req.body.queryId}, (err, query) => {
          query.status = req.body.status;

          query.save((err) => {
               if(err) {
                    sendJSONresponse(res, 400, {
                         "message": "Something is Wrong. We are working it out. Try again."
                    });
                    return;
               };
               res.status(200);
               res.json("Request Successfull.");
               // uncomment these if you want to send the notifications by twilio and nodemailer
               //var msg = 'the status of query has been changed please check';
               //twilioSms.notify('Admin', msg);
               //mailer.mail('Admin', msg);
               //twilioSms.notify(query.user.email, msg);
               //mailer.mail(query.user.email, msg);
          })
     });
};

module.exports.postAnswer = (req, res) => {                 // function to add a new answer in the conversation of a perticular query
     var obj = {
          msg: req.body.msg,
          sentby: {
               name: req.body.name,
               designation: req.body.batch
          },
          sentOn: Date.now()
     };

     Queries.findOneAndUpdate({'_id': req.body.queryId}, { $push: {conversation: obj}}, (err) => {
          if(err) {
               sendJSONresponse(res, 400, {
                    "message": "Something is Wrong. We are working it out. Try again."
               });
               return;
          };
          res.status(200);
          res.json("Request Successfull.");
          // uncomment these if you want to send the notifications by twilio and nodemailer
          /*Queries.findOne({'_id': req.body.queryId}, (err, obj) => {
               var msg = 'Your query has been Answered. Please check.'
               twilioSms.notify(obj.user.email, msg);
               mailer.mail(obj.user.email, msg);
          });*/
     })
};

module.exports.deleteAnswer = (req, res) => {             // function to delete a particular answer from the conversation of a particular query, when called
     Queries.findOne({'_id': req.body.queryId}, (err, query) => {

          query.conversation.splice(req.body.convoNumber,1);

          query.save((err) => {
               if(err) {
                    sendJSONresponse(res, 400, {
                         "message": "Something is Wrong. We are working it out. Try again."
                    });
                    return;
               };
               res.status(200);
               res.json("Request Successfull.");
          })
     });
};

module.exports.deleteQuery = (req, res) => {          // function to delete a particular query from the database, when called.
     Queries.findOne({'_id': req.body.queryId}, (err, query) => {
          if(req.body.batch != 'Admin'){
               sendJSONresponse(res, 400, {
                    "message": "Only admin Can delete it."
               });
               return;
          }

          query.remove((err) => {
               if(err) {
                    sendJSONresponse(res, 400, {
                         "message": "Something is Wrong. We are working it out. Try again."
                    });
                    return;
               };
               res.status(200);
               res.json("Request Successfull.");
          })
     });
};
