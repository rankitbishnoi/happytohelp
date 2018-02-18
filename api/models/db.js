var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect("mongodb://localhost/happyToHelpApp");

mongoose.connection.on('connected', () => {
     console.log('Mongoose connected to mongodb://localhost/happyToHelpApp');
});

mongoose.connection.on('error',(err) => {
     console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
     console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
     mongoose.connection.close(() => {
          console.log('Mongoose disconnected through app termination');
          process.exit(0);
     });
});

//=====================================
