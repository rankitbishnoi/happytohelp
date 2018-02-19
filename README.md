# [HappytoHelp](https://github.com/rankitbishnoi/happytohelp):
It is an Ticket Based web-app for user to raise their queries and they will be answered by the Administrators.

## This web-app is based on MEANjs Platform and MVC architecture:
* The back-end is based on Nodejs, Express, mongoose.
* The front-end is based on angularjs and bootstrap is used as css framework.
* Mongodb is used for database in this app.
* The authentication is done using the JWT, for which I have used [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to generate the JWT and [express-jwt](https://www.npmjs.com/package/express-jwt) to verify.

**To start the app:**

     Install the nodejs, Npm and Mongodb.

1. Open the terminal.
2. Start the mongodb.
3. Type:
```
          npm install
          node start server.js
```

**This web app is made with back-end and front-end combined together.**
1. When you run the app. It will listen the request on port 3000.
2. Visit http://localhost:3000/happytohelp to start the app on front-end.
3. if you place the whole app on any server and use the software like nginx or any else. Please change the $http request links accordingly.

**If you want to make the back-end and front-end separate. Then,**
1. Delete the code in line from 36 to 41 in app.js file in the root directory.
2. Host the client folder in the server you want and use any driver like nginx to direct the traffic to index.html in the client folder.
3. Place the other back-end in the server directory you want and run the app as well as change all the $http request links in front-end accordingly.

## Basic Feature:

1. User and can view all the queries with filter like
```
   * Queries raised by himself- that are still not resolved.
   * Queries raised by himself- that has been resolved.
   * Queries raised by all the users - that are still not resolved.
   * Queries raised by all users - that has been resolved.
```
2. User will get a total number of Queries raised by him on the screen and also the number that has been resolved until now.
3. User can not delete the queries or the answer on those queries.
4. User Can change the status of the queries, Once he thinks that the query has rightly been answered and he is satisfied.
5. Admin Panel have only two filters as he can not put up queries:
```
   * Queries that are still pending.
   * Queries that has been resolved.
```
6. Admin panel will show the Total Number of queries that has been asked and the Number of queries that has been resolved.
7. While registering there is a batch input column which should only be used by the admin.
```
   * In that column admin will put the code provided by the company to register.
   * That code differentiate the user and the admin.
   * Currently the code is '1234', but you can change it in the (./api/controller/auth.js)
```
8. The queries panel holds only 10 queries at a time which are sorted on the basis that latest one comes first. If you want to look older one click on the button older.
9. For providing the Notification to the user and admin [TWILIO](https://www.npmjs.com/package/twilio) and [NODEMAILER](https://www.npmjs.com/package/nodemailer) is used. SO that they not only get the email notification but also the sms notifications. More details about them is provide down.
10. For login and register Ui-bootstrap modal are used at the front-end and passport configuration file is used at the back-end.
11. For encrypting the password crypto(which is nodejs native function) is used.
12. For authentication on every request JWT is used which will be provided to client-side on time of registering or login. There is also a expiry time for those tokens which you can change.


**In this app I have commented out the functionality of notifying the user and admin when they create an query or answer any query.**
I have used:
1. [Twilio](https://www.npmjs.com/package/twilio) for the sms notifications of account activities.
2. [Nodemailer](https://www.npmjs.com/package/nodemailer) for the email notifications of the account activities.

* To use twilio, change the accountSid and authToken in file (./api/controller/twiliosms.js). you have to create an account in the twilio website to get those details.
* To use the Nodemailer, change the email account and passkey to you own in file (./api/controller/Nodemailer.js).

## Developer :
Name: **Rankit Bishnoi**   
E-mail: rankitgodara1@gmail.com   
Mobile Number: +919416061874   
