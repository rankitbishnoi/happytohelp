var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  email: {type: String, unique: true, required: true},
  name: {type: String, required: true},
  username: {type: String, unique: true, required: true},
  mobileNumber: {type: Number, unique: true, required: true},
  batch: String,
  hash: String,
  salt: String
});

userSchema.methods.setPassword = function(password){           // schema method to encrypt the password while registering the user
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {          // schema method to verify the password provided by the user while logging in
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {                // schema to generate the JWT using jsonwebtoken npm 
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    batch: this.batch,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET");
};

mongoose.model('User', userSchema);
