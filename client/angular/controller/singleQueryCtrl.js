myapp.controller('singleQueryCtrl', ['$uibModal','$log','$document','fetchTicket','queryCRUD','$localStorage','$rootScope','$state', function($uibModal, $log, $document, fetchTicket,queryCRUD,$localStorage,$rootScope,$state) {
     var self = this;

     self.parseJwt = (token) => {                    // function to decode the token saved in the localStorage
          try {
               return JSON.parse(atob(token.split('.')[1]));
          } catch (e) {
               return null;
          }
     };

     if ($localStorage.token != undefined) {                   // function to send the user to "home" in case the token is not set yet(user is not loggedin yet) or it is exired
          self.info = self.parseJwt($localStorage.token);
          var dateNow = new Date();
          self.info.exp = (self.info.exp*1000);
          if(self.info.exp < dateNow.getTime()){
               $state.go('home');
          }
     }else {
          $state.go('home');
     }


     self.ticket =  fetchTicket.getTicket();                         // fetch the query data from the service that app set in query at previous state
     if (self.ticket === undefined) {                          // check if there is no such data awailable this will transfer user back to the query state
          $state.go('query');
     }

     $rootScope.$on('unsuccessful', () => {                    // thsi listen to all the unsuccessful attempts of requests by the service to server and calls alert modal to show the user
          self.alert();
     });

     self.postAnswer = () => {                           // to call the service function to post the answer on the particaular query's conversation with the answer provided by the user
          queryCRUD.postAnswer($localStorage.token, self.ticket._id, self.msg, self.info.name, self.info.batch);
     }

     if (self.info.batch === 'Admin') {               // store the variable accordingly to show/hide html elements on the base of the batch of user, if he/she is admin or user
          self.admin = true;
          self.user = false;
     }else {
          self.admin = false;
          self.user = true;
     }

     $rootScope.$on('successfull posted answer', () => {    // this listens to the successfull attempt emited by the service for posting answer
          if (self.msg != undefined) {
               var obj = {
                    msg: self.msg,
                    sentby: {
                         name: self.info.name,
                         designation: self.info.batch
                    },
                    sentOn: Date.now()
               };
               self.ticket.conversation.push(obj);  // this will add the answer to the front-end to show the user ofr now, this is done so that we don't fetch again the new query data after saving the answer in it.
               self.msg = '';
          }
     });

     self.deleteAnswer = (index) => {           // function to intiate the deletion of the answer(can only be done by the Admin)
          self.count = true;                   // counter to ensure that only one answer is deleted on the front-end
          self.index = index;                    // index of the answer admin want to delete in the query conversation
          self.warningFunction = "deleteAnswer"; // warning modal description used further in code
          self.warning();                 // calling the warning modal for the admin
     }

     $rootScope.$on('successfull deleted answer', (evt, index) => { // listening to success of the deletion emited by the service after successfull response from server
          if (self.count === true) {                  //condition to ensure only one answer is deleted from the array
               self.ticket.conversation.splice(index, 1);
               self.count = false;
          }
     });

     self.deleteQuery = () => {             // function to intiate the deletion of the query(can only be done by the Admin)
          self.warningFunction = "deleteQuery";        // warning modal description used further in code
          self.warning();              // calling the warning modal for the admin
     }

     $rootScope.$on('successfull deleted Query', () => {       // listening to success of the deletion emited by the service after successfull response from server
          $state.go('query');
     });

     self.status = {         // to determine the state of queries status
          open : '',
          closed : ''
     };

     if (self.ticket.status === true) { // to change the status of query on the base of data fetched from service
          self.status.open = 'active';
          self.status.closed = '';
     }else if(self.ticket.status === false) {
          self.status.open = '';
          self.status.closed = 'active';
     }

     self.statusState = (status) => {             // function to call the service function to change the status of query when user clickes on the button
          if (status === "open" && self.status.open != 'active') {
               queryCRUD.changeStatus($localStorage.token, self.ticket._id, true); // service function call to make the query open
          }else if (status === "closed" && self.status.closed != 'active') {
               queryCRUD.changeStatus($localStorage.token, self.ticket._id, false); // serviced function call to make the query closed
          }
     }

     $rootScope.$on('successfull changed status', (evt, status) => {  // listening to the success emitted by the service function on successfull response from server
          if (status === true) {             // change the status of the present query accordingly
               self.status.open = 'active';
               self.status.closed = '';
          }else if(status === false) {
               self.status.open = '';
               self.status.closed = 'active';
          }
     });

     self.animationsEnabled = true;    // animation configuration of the modal used in controller

     self.alert = function (size, parentSelector) {             // function to open the alert modal
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
          }).result.catch(function (resp) { // to catch the events like click by user outside the modal
               if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
          });
     };

     self.warning = function (size, parentSelector) {             // function to open the warning modal
          $uibModal.open({
               animation: self.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               templateUrl: 'warning.html',
               size: 'sm',
               controller: function($scope,$uibModalInstance) {      // modal controller


                    $scope.yes = () => {   // function when user agrees with warning,
                         if (self.warningFunction === "deleteAnswer") { // condition to check the warning description set by the function call in above code
                              queryCRUD.deleteAnswer($localStorage.token, self.ticket._id, self.index);
                         }else if (self.warningFunction === "deleteQuery") {
                              queryCRUD.deleteQuery($localStorage.token, self.ticket._id, self.info.batch);
                         }
                         $uibModalInstance.close(); // close the modal after user responds to the warning modal
                    }



                    $scope.ok = () => {                                      // function to close the modal
                         $uibModalInstance.close();
                    };
               }
          }).result.catch(function (resp) {            // to catch the events like click by user outside the modal
               if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
          });
     };

}]);
