var app = require('./app');
var helmet = require('helmet');
app.use(helmet()); // for security

//=====================================

var server = app.listen(3000, () => {
     console.log("listening on port 3000");
});
