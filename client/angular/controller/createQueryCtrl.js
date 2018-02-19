myapp.controller('createQueryCtrl', ['$uibModal','$log','$document','createQ','$localStorage','$rootScope','$state', function($uibModal, $log, $document, createQ, $localStorage, $rootScope, $state) {
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

     self.post = () => {
          createQ.postQuery($localStorage.token, self.subject, self.description, self.info.name, self.info.email);
     }

     $rootScope.$on('successfull posted query', () => {
          $state.go('query');
     });

     $rootScope.$on('unsuccessful', () => {
          $state.go('query');
     });

     self.animationsEnabled = true;

     self.alert = function (size, parentSelector) {             // function to open the modal
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
