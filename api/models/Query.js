var mongoose = require( 'mongoose' );

var querySchema = new mongoose.Schema({
  subject: {type:String, required: true},
  content: {type:String, required: true},
  status: Boolean,
  user: {
    name: {type:String, required: true},
    email: {type:String, required: true}
  },
  createdOn: Date,
  conversation: [{
    msg: String,
    sentby: {
      name: String,
      designation: String
    },
    sentOn: Date
  }]
});

mongoose.model('Query', querySchema);
