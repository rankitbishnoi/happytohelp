myapp.controller('singleQueryCtrl', ['fetchTicket','queryCRUD','$localStorage','$rootScope', function(fetchTicket,queryCRUD,$localStorage,$rootScope) {
     var self = this;

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


     self.ticket =  fetchTicket.getTicket();
     if (self.ticket === undefined) {
          $state.go('query');
     }

     $rootScope.$on('unsuccessful', (msg) => {
          if (msg === "postAnswer") {

          }else if (msg === "deleteAnswer") {

          }else if (msg === "changeStatus") {
               
          }
     });

     self.postAnswer = () => {
          queryCRUD.postAnswer($localStorage.token, self.ticket.id, self.msg, self.info.name, self.info.batch);
     }

     $rootScope.$on('successfull posted answer', () => {
          var obj = {
               msg: self.msg,
               sentby: {
                    name: self.info.name,
                    designation: self.info.batch
               },
               sentOn: Date.now()
          };
          self.ticket.conversation.push(obj);
     });

     self.deleteAnswer = (index) => {
          queryCRUD.deleteAnswer($localStorage.token, self.ticket.id, index);
     }

     $rootScope.$on('successfull deleted answer', () => {
          self.ticket.conversation.splice(index, 1);
     });


     self.status = {
          open : '',
          closed : ''
     };

     if (self.ticket.status === true) {
          self.status.open = 'active';
          self.status.closed = '';
     }else if(self.ticket.status === false) {
          self.status.open = '';
          self.status.closed = 'active';
     }

     self.statusState = (status) => {
          if (status === "open" && self.status.open != 'active') {
               queryCRUD.changeStatus($localStorage.token, self.ticket.id, status);
          }else if (status === "closed" && self.status.closed != 'active') {
               queryCRUD.changeStatus($localStorage.token, self.ticket.id, status);
          }
     }

     $rootScope.$on('successfull deleted answer', (status) => {
          if (status === "open") {
               self.status.open = 'active';
               self.status.closed = '';
          }else if(status === "closed") {
               self.status.open = '';
               self.status.closed = 'active';
          }
     });

}]);
