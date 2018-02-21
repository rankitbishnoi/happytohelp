var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({              // middleware to verify the token provided w=by the user when he requests to the server.
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlAuth = require('../controllers/auth');
var ctrlQuery = require('../controllers/query');

// authentication routers
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// query routers
router.get('/getQueryList', auth, ctrlQuery.getQueryList);
router.post('/createQuery', auth, ctrlQuery.createQuery);
router.post('/changeStatus', auth, ctrlQuery.changeStatus);
router.post('/deleteQuery', auth, ctrlQuery.deleteQuery);
router.post('/postAnswer', auth, ctrlQuery.postAnswer);
router.post('/deleteAnswer', auth, ctrlQuery.deleteAnswer);

module.exports = router;
