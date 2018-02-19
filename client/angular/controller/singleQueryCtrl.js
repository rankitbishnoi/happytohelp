myapp.controller('singleQueryCtrl', ['$uibModal','$log','$document','fetchTicket','queryCRUD','$localStorage','$rootScope','$state', function($uibModal, $log, $document, fetchTicket,queryCRUD,$localStorage,$rootScope,$state) {
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
     if (self.ticket === undefined) {console.log('hi');
          $state.go('query');
     }

     $rootScope.$on('unsuccessful', () => {
          self.alert();
     });
     self.postAnswer = () => {
          queryCRUD.postAnswer($localStorage.token, self.ticket._id, self.msg, self.info.name, self.info.batch);
     }

     if (self.info.batch === 'Admin') {
          self.admin = true;
          self.user = false;
     }else {
          self.admin = false;
          self.user = true;
     }

     $rootScope.$on('successfull posted answer', () => {
          if (self.msg != undefined) {
               var obj = {
                    msg: self.msg,
                    sentby: {
                         name: self.info.name,
                         designation: self.info.batch
                    },
                    sentOn: Date.now()
               };
               self.ticket.conversation.push(obj);
               self.msg = '';
          }
     });

     self.deleteAnswer = (index) => {
          self.count = true;
          self.index = index;
          self.warningFunction = "deleteAnswer";
          self.warning();
     }

     $rootScope.$on('successfull deleted answer', (evt, index) => {
          if (self.count === true) {
               self.ticket.conversation.splice(index, 1);
               self.count = false;
          }
     });

     self.deleteQuery = () => {
          self.warningFunction = "deleteQuery";
          self.warning();
     }

     $rootScope.$on('successfull deleted Query', () => {
          $state.go('query');
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
               queryCRUD.changeStatus($localStorage.token, self.ticket._id, true);
          }else if (status === "closed" && self.status.closed != 'active') {
               queryCRUD.changeStatus($localStorage.token, self.ticket._id, false);
          }
     }

     $rootScope.$on('successfull changed status', (evt, status) => {
          if (status === true) {
               self.status.open = 'active';
               self.status.closed = '';
          }else if(status === false) {
               self.status.open = '';
               self.status.closed = 'active';
          }
     });

     self.animationsEnabled = true;

     self.alert = function (size, parentSelector) {             // function to open the modal
          $uibModal.open({
               animation: self.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               templateUrl: 'alert.html',
               size: 'sm',
               controller: function($scope,$uibModalInstance) {      // modal controller



                    $scope.ok = () => {                                      // function to close the modal
                         $uibModalInstance.close();
                    };
               }
          }).result.catch(function (resp) {
               if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
          });
     };

     self.warning = function (size, parentSelector) {             // function to open the modal
          $uibModal.open({
               animation: self.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               templateUrl: 'warning.html',
               size: 'sm',
               controller: function($scope,$uibModalInstance) {      // modal controller


                    $scope.yes = () => {
                         if (self.warningFunction === "deleteAnswer") {
                              queryCRUD.deleteAnswer($localStorage.token, self.ticket._id, self.index);
                         }else if (self.warningFunction === "deleteQuery") {
                              queryCRUD.deleteQuery($localStorage.token, self.ticket._id, self.info.batch);
                         }
                         $uibModalInstance.close();
                    }



                    $scope.ok = () => {                                      // function to close the modal
                         $uibModalInstance.close();
                    };
               }
          }).result.catch(function (resp) {
               if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
          });
     };

}]);
