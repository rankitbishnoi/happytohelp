myapp.controller('queryCtrl', ['$localStorage','$state','fetchQuery','$interval','fetchTicket', function($localStorage, $state, fetchQuery, $interval, fetchTicket) {
     var self = this;
     self.list = [];

     self.parseJwt = (token) => {              // function to decode the token saved in the localStorage
          try {
               return JSON.parse(atob(token.split('.')[1]));
          } catch (e) {
               return null;
          }
     };

     if ($localStorage.token != undefined) {         // function to send the user to "home" in case the token is not set yet(user is not loggedin yet) or it is exired
          self.info = self.parseJwt($localStorage.token);
          var dateNow = new Date();
          self.info.exp = (self.info.exp*1000);
          if(self.info.exp < dateNow.getTime()){
               $state.go('home');
          }
     }else {
          $state.go('home');
     }

     if (self.info.batch === 'Admin') {                     // store the variable accordingly to show/hide html elements on the base of the batch of user, if he is admin or user
          self.admin = true;
          self.user = false;
     }else {
          self.admin = false;
          self.user = true;
     }

     self.filter = {                                       // filters to decide the list of queries
          raisedBy : {  myself : '',   allusers : 'active'},
          status : { open : 'active',  closed : ''}
     }

     self.filterState = (filterType) => {                  // to change the filter element class when called
          if (filterType === 'myself') {
               self.filter.raisedBy.myself = 'active';
               self.filter.raisedBy.allusers = '';
          }else if (filterType === 'allusers') {
               self.filter.raisedBy.myself = '';
               self.filter.raisedBy.allusers = 'active';
          }else if (filterType === 'open') {
               self.filter.status.open = 'active';
               self.filter.status.closed = '';
          }else if (filterType === 'closed') {
               self.filter.status.open = '';
               self.filter.status.closed = 'active';
          }
          self.retriveQueryList(1);                            //to fetch the results on the base of changed filters
     }

     $interval(function(){                                     //  as the http requests are asynconous from the service, this function us to check for the data that come after some time form the server.
          if (fetchQuery.totalQueries === 0) {                 // it recives all the data changes
               self.totalQueryPage = 1;
          }else {
               self.totalQueryPage = Math.ceil((fetchQuery.totalQueries)/10);     // varibale to recieve total number of queries in database filterred acording to the filters set above
          }

          self.totalQueryRaised = fetchQuery.totalQueryRaised;        // variable to get the count of total queries raised by the user
          self.resolvedQuery = fetchQuery.resolvedQuery;              // varibale to store the count of query resolved which are raise dby that user
          self.totalQuery = fetchQuery.totalQuery;                        // variableto store total number of queries raised on this app
          self.resolved = fetchQuery.resolved;                       // variable to store total queries resolved in the app
          self.checkPagination();                                   // function to check the pagination options
          self.list = fetchQuery.list;                            // array to store the fetched query list
     }, 500);

     self.retriveQueryList = (page) => {               // function to fetch the query list on the base of changed filters
          var status;
          if (self.filter.status.open === 'active') {   // filter to get open or closed queries
               status = 'open';
          }
          else if (self.filter.status.closed === 'active') {
               status = 'closed';
          }

          if (self.filter.raisedBy.myself === 'active') {
               fetchQuery.queryListMyself($localStorage.token, status, page, self.info.email);       //  serviec function to get all the queries raised by the particular user
               fetchQuery.queryListMyselfCount($localStorage.token, status, self.info.email);       // service function to get the count of all the queries arised by th euser logged in
          }else if (self.filter.raisedBy.allusers === 'active') {
               fetchQuery.queryListAllUsers($localStorage.token, status, page);                     // service function to gett all the queries raised by all the users
               fetchQuery.queryListAllUsersCount($localStorage.token, status);                    // service functiont to get the count of the queries raised by all the users on this app
          }
     }


     self.retriveQueryList(1);                                       // intital call when the page is opened
     fetchQuery.myselfTotalQueriesCount($localStorage.token, self.info.email);   // service function calll to get the count of queries raised by the user logged in
     fetchQuery.myselfResolvedQueryCount($localStorage.token, self.info.email);  // service function to get the count of all the resolved queries that were raised by the user logged in
     fetchQuery.TotalQueriesCount($localStorage.token);        // service function to get the count of all the queries raised on the app
     fetchQuery.queryresolvedCount($localStorage.token);           // servcie function to get the count of all the queries resolved on the app

     self.presentPage = 1;                               // assigning initally page value to the queries pagination variable
     self.checkPagination = () => {                     // function to check if the Older page button or the newer page button should be shown or hidden
          if (self.presentPage === 1 && self.presentPage === self.totalQueryPage){  // both hidden if there is less than 10 queries in list
               self.newer = false;
               self.older = false;
          }else if (self.presentPage === 1){           // newer hidden if the present page is the first one as the query list sorted from newer to older
               self.newer = false;
               self.older = true;
          }else if (self.presentPage === self.totalQueryPage) {  // older hidden if user is on the last page of query list
               self.newer = true;
               self.older = false;
          }else {                                            // both shown if the user is in some middle page of query list
               self.newer = true;
               self.older = true;
          }
     }

     self.checkPagination();                         // intital call to check pagination

     self.olderQueryPage = () => {                              // to fetch queries of next page if the older button is pressed
          if (self.presentPage != self.totalQueryPage) {
               self.presentPage++;
               self.retriveQueryList(self.presentPage);
               self.checkPagination();
          }
     }

     self.newerQueryPage = () => {                           //  to fetch queries of previous page if the newer button is pressed
          if (self.presentPage > 1) {
               self.presentPage--;
               self.retriveQueryList(self.presentPage);
               self.checkPagination();
          }
     }

     self.changeState = (ticket) => {                     // to go to the singleQueryPage with the setting that query in service
          fetchTicket.setTicket(ticket);
          $state.go('queryId');
     }

     self.countAnswers = (user, conversation) => {            // count the answers given by the other users and admin on the query raised by that user.
          var i = 0;
          conversation.forEach((msg) => {
               if (msg.sentby.name != user) {
                    i++;
               }
          });
          self.answers = i;
     }

}]);
