myapp.controller('queryCtrl', ['$localStorage','$state','fetchQuery','$interval','fetchTicket', function($localStorage, $state, fetchQuery, $interval, fetchTicket) {
     var self = this;
     self.list = [];

     self.parseJwt = (token) => {
          try {
               return JSON.parse(atob(token.split('.')[1]));
          } catch (e) {
               return null;
          }
     };

     if ($localStorage.token != undefined) {
          self.info = self.parseJwt($localStorage.token);
          var dateNow = new Date();
          self.info.exp = (self.info.exp*1000);
          if(self.info.exp < dateNow.getTime()){
               $state.go('home');
          }
     }else {
          $state.go('home');
     }

     self.filter = {
          raisedBy : {  myself : '',   allusers : 'active'},
          status : { open : 'active',  closed : ''}
     }

     self.filterState = (filterType) => {
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
          self.retriveQueryList(1);
     }

     $interval(function(){
          if (fetchQuery.totalQueries === 0) {
               self.totalQueryPage = 1;
          }else {
               self.totalQueryPage = Math.ceil((fetchQuery.totalQueries)/10);
          }

          self.totalQueryRaised = fetchQuery.totalQueryRaised;
          self.resolvedQuery = fetchQuery.resolvedQuery;
          self.checkPagination();
          self.list = fetchQuery.list;
     }, 500);

     self.retriveQueryList = (page) => {
          var status;
          if (self.filter.status.open === 'active') {
               status = 'open';
          }
          else if (self.filter.status.closed === 'active') {
               status = 'closed';
          }

          if (self.filter.raisedBy.myself === 'active') {
               fetchQuery.queryListMyself($localStorage.token, status, page, self.info.email);
               fetchQuery.queryListMyselfCount($localStorage.token, status, self.info.email);
          }else if (self.filter.raisedBy.allusers === 'active') {
               fetchQuery.queryListAllUsers($localStorage.token, status, page);
               fetchQuery.queryListAllUsersCount($localStorage.token, status);
          }
     }


     self.retriveQueryList(1);
     fetchQuery.myselfTotalQueriesCount($localStorage.token, self.info.email);
     fetchQuery.myselfResolvedQueryCount($localStorage.token, self.info.email);

     self.presentPage = 1;
     self.checkPagination = () => {
          if (self.presentPage === 1 && self.presentPage === self.totalQueryPage){
               self.newer = false;
               self.older = false;
          }else if (self.presentPage === 1){
               self.newer = false;
               self.older = true;
          }else if (self.presentPage === self.totalQueryPage) {
               self.newer = true;
               self.older = false;
          }else {
               self.newer = true;
               self.older = true;
          }
     }

     self.checkPagination();

     self.olderQueryPage = () => {
          if (self.presentPage != self.totalQueryPage) {
               self.presentPage++;
               self.retriveQueryList(self.presentPage);
               self.checkPagination();
          }
     }

     self.newerQueryPage = () => {
          if (self.presentPage > 1) {
               self.presentPage--;
               self.retriveQueryList(self.presentPage);
               self.checkPagination();
          }
     }

     self.changeState = (ticket) => {
          fetchTicket.setTicket(ticket);
          $state.go('queryId');
     }

     self.countAnswers = (user, conversation) => {
          var i = 0;
          conversation.forEach((msg) => {
               if (msg.sentby.name != user) {
                    i++;
               }
          });
          self.answers = i;
     }

}]);
