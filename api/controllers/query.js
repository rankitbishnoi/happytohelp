var mongoose = require('mongoose');
var Queries = mongoose.model('Query');

//var twilioSms = require('./twilioSms.js')
//var mailer = require('./nodeMailer.js')

var sendJSONresponse = function(res, status, content) {
     res.status(status);
     res.json(content);
};


module.exports.getQueryList = (req, res) => {
     var page = parseInt(req.body.page);
     var query = {};
     var cursor;
     if (req.query.count === 'false') {
          if (req.query.status != undefined && req.query.status === 'open') {
               query.status = true;
          }else if (req.query.status != undefined && req.query.status === 'closed'){
               query.status = false;
          }

          if (req.query.raisedBy === 'true') {
               query["user.email"] = req.query.email;
          }

          cursor = Queries.find({$and:[query]}).sort({'createdOn':-1}).skip((page*10)).limit(10);
     }else if (req.query.count === 'true'){
          if (req.query.total === 'true') {
               query["user.email"] = req.query.email;
          }

          if (req.query.resolved === 'true') {
               query.status = false;
          }

          if (req.query.status != undefined && req.query.status === 'open') {
               query.status = true;
          }else if (req.query.status === 'closed'){
               query.status = false;
          }

          if (req.query.raisedBy === 'true') {
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

module.exports.createQuery = (req, res) => {
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

          var msg = 'New Query Has been uploaded by '+ query.user.name;
          //twilioSms.notify('Admin', msg);
          //mailer.mail('Admin', msg);
     })
};

module.exports.changeStatus = (req, res) => {
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
          })
     });
};

module.exports.postAnswer = (req, res) => {
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

          /*Queries.findOne({'_id': req.body.queryId}, (err, obj) => {
               var msg = 'Your query has been Answered. Please check.'
               twilioSms.notify(obj.user.email, msg);
          });*/

          //mailer.mail(obj.user.email, msg);
     })
};

module.exports.deleteAnswer = (req, res) => {
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

module.exports.deleteQuery = (req, res) => {
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
