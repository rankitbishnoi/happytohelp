myapp.controller('createQueryCtrl', ['$uibModal','$log','$document','createQ','$localStorage','$rootScope','$state', function($uibModal, $log, $document, createQ, $localStorage, $rootScope, $state) {
     var self = this;

     self.parseJwt = (token) => {           // function to decode the token saved in the localStorage
          try {
               return JSON.parse(atob(token.split('.')[1]));
          } catch (e) {
               return null;
          }
     };

     if ($localStorage.token != undefined) {                    // function to send the user to "home" in case the token is not set yet(user is not loggedin yet) or it is exired
          self.info = self.parseJwt($localStorage.token);
          var dateNow = new Date();
          self.info.exp = (self.info.exp*1000);
          if(self.info.exp < dateNow.getTime()){
               $state.go('home');
          }
     }else {
          $state.go('home');
     }

     self.post = () => {                           // function to call the function in createQ service while will initiate the query creation request to the server
          createQ.postQuery($localStorage.token, self.subject, self.description, self.info.name, self.info.email);
     }

     $rootScope.$on('successfull posted query', () => {      // listen to the event emited by the service about success of query creation
          $state.go('query');
     });

     $rootScope.$on('unsuccessful', () => {          // listen to the event emited by the service about unsuccessful attempt of query creation
          $state.go('query');
     });

     self.animationsEnabled = true;                   // variable to decide that the modal should apear and disappera with anumation or not

     self.alert = function (size, parentSelector) {             // function to open the modal in case the query creation attemp is not successful
          $uibModal.open({
               animation: self.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               template: '<div class="alert alert-danger" role="alert" id="modal-title"><p> Could Not Complete The operation. Please Try again, After sometime.</p><button ngclick = "ok()" class = "btn-default">Ok</button></div>',
               size: 'sm',
               controller: function($scope,$uibModalInstance) {      // modal controller



                    $scope.ok = () => {                                      // function to close the modal
                         $uibModalInstance.close();
                         $state.go('query');
                    };
               }
          }).result.catch(function (resp) {
               if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
          });
     };
}]);
