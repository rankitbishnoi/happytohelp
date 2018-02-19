myapp.controller('loginCtrl',['$uibModal','$log','$document','$http','$localStorage','$state','$transitions', function ($uibModal, $log, $document, $http, $localStorage, $state, $transitions) {
     var $ctrl = this;

     $ctrl.logoutbtn = false;
     $ctrl.loginbtn = true;

     $ctrl.parseJwt = (token) => {
          try {
               return JSON.parse(atob(token.split('.')[1]));
          } catch (e) {
               return null;
          }
     };

     if($localStorage.token != undefined) {

          $ctrl.info = $ctrl.parseJwt($localStorage.token);
          var dateNow = new Date();
          $ctrl.info.exp = ($ctrl.info.exp*1000);
          if($ctrl.info.exp < dateNow.getTime()){
               $ctrl.loginbtn = true;
          }else {
               $ctrl.loginbtn = false;
          }
     }
     $ctrl.logoutbtn = !$ctrl.loginbtn;
     $ctrl.logout = () => {
          $localStorage.token = undefined;
          $ctrl.loginbtn = true;
          $ctrl.logoutbtn = false;
          $state.go('home');
     }

     if ($ctrl.loginbtn === true) {
          $ctrl.letsGetStarted = ()=> { $ctrl.login();}
     }else {
          $ctrl.letsGetStarted = ()=> { $state.go('query');}
     }

     $ctrl.animationsEnabled = true;

     $ctrl.login = function (size, parentSelector) {             // function to open the modal
          $uibModal.open({
               animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title-bottom',
               ariaDescribedBy: 'modal-body-bottom',
               templateUrl: 'login.html',
               size: 'md',
               controller: function($scope,$uibModalInstance,$localStorage,$state) {      // modal controller

                    $scope.loginNow = function (){
                         $scope.error = undefined;
                         if ($scope.lemail === 'Email' || $scope.lpassword === 'password' || $scope.lemail === null || $scope.lpassword === null || $scope.lemail === undefined || $scope.lpassword === undefined ){
                              $scope.error = 'Please enter valid Email id and password.';
                              $scope.lemail = '';
                              $scope.lpassword = '';
                         } else {
                              var data = { email: $scope.lemail, password: $scope.lpassword};
                              $http.post('http://localhost:3000/api/login', data).then(function successCallback(response){
                                   if (response.status === 200) {
                                        $localStorage.token=response.data.token;
                                        $scope.ok();
                                        $ctrl.info = $ctrl.parseJwt($localStorage.token);
                                        $ctrl.loginbtn = false;
                                        $ctrl.logoutbtn = true;

                                        $state.go('query');
                                   }

                                   //what to do on success
                              },function errorCallback(err){
                                   $scope.lemail = '';
                                   $scope.lpassword = '';
                                   if(err.status === 401) {
                                        $scope.error = "Wrong Id or password. Please try again.";
                                   }else if (err.status === 400) {
                                        $scope.error = "Please Enter both id and password.";
                                   }else if (err.status === 404) {
                                        $scope.error = "Server is down. Please try after some time.";
                                   }

                              });
                         };
                    };

                    $scope.register = () => {
                         $uibModalInstance.close();
                         $ctrl.register();
                    }

                    $scope.ok = () => {                                      // function to close the modal
                         $uibModalInstance.close();
                    };
               }
          }).result.catch(function (resp) {
               if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
          });
     };

     $ctrl.register = function (size, parentSelector) {             // function to open the modal
          $uibModal.open({
               animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title-bottom',
               ariaDescribedBy: 'modal-body-bottom',
               templateUrl: 'register.html',
               size: 'md',
               controller: function($scope,$uibModalInstance,$localStorage,$state) {      // modal controller

                    $scope.registerNow = function () {
                         var letters = /^[A-Za-z]+$/;
                         var letterNumber = /^[0-9a-zA-Z]+$/;
                         var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                         var mobile = /^(\+[\d]{1,3}|0)?[7-9]\d{9}$/;
                         var number = /[0-9]/;
                         var lowercase = /[a-z]/;
                         var uppercase = /[A-Z]/;
                         $scope.rerror = undefined;
                         $scope.nameerror = undefined;
                         $scope.usernameerror = undefined;
                         $scope.emailerror = undefined;
                         $scope.passworderror = undefined;
                         $scope.confirmpassworderror = undefined;
                         $scope.mobileNumbererror = undefined;
                         if ($scope.email === ' ' || $scope.password === ' ' || $scope.name === ' ' || $scope.username === ' ' || $scope.mobileNumber === ' '){
                              $scope.rerror = 'Please enter valid Email id and password.';
                         }else if ($scope.email === 'email' || $scope.password === 'password' || $scope.name === 'name' || $scope.username === 'username' || $scope.mobileNumber === 'mobileNumber'){
                              $scope.rerror = 'Please enter valid Data in Fields.';
                         }else if (!$scope.name.match(letters)) {
                              $scope.nameerror = " Please use only alphabet characters.";
                         }else if (!$scope.username.match(letterNumber)) {
                              $scope.usernameerror = " Please use only alphabet characters and numbers.";
                         }else if (!$scope.email.match(mailformat)) {
                              $scope.emailerror = " Please use valid email address.";
                         }else if (!$scope.mobileNumber.match(mobile)) {
                              $scope.mobileNumbererror = " Please use valid Mobile Number.";
                         }else if ($scope.password.length < 8) {
                              $scope.passworderror = " Please use password greater or equal to 8 characters.";
                         }else if (!$scope.password.match(number)) {
                              $scope.passworderror = " Please use password with at least one numerical character.";
                         }else if (!$scope.password.match(lowercase)) {
                              $scope.passworderror = " Please use password with at least one lowercase alphabatic character.";
                         }else if (!$scope.password.match(uppercase)) {
                              $scope.passworderror = " Please use password with at least one uppercase alphabatic character.";
                         }else if ($scope.password != $scope.confirmpassword) {
                              $scope.confirmpassworderror = 'The password do not match. Please type again.';
                         }else {
                              var data = {
                                   email: $scope.email,
                                   password: $scope.password,
                                   name: $scope.name,
                                   username: $scope.username,
                                   mobileNumber: $scope.mobileNumber,
                                   batch: $scope.batch,
                              };
                              $http.post('http://localhost:3000/api/register', data).then(function successCallback(response){
                                   // what to do when success
                                   $localStorage.token=response.data.token;
                                   $scope.ok();
                                   $ctrl.info = $ctrl.parseJwt($localStorage.token);
                                   $ctrl.loginbtn = false;
                                   $ctrl.logoutbtn = true;
                                   $state.go('query');

                              }, function errorCallback(err){
                                   if (err.status === 400) {
                                        $scope.rerror = "Please Enter both id and password.";
                                   }
                              });
                         }
                    }

                    $scope.ok = () => {                                      // function to close the modal
                         $uibModalInstance.close();
                    };
               }
          }).result.catch(function (resp) {
               if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
          });
     };

     $ctrl.stateBck = 'homebck';

     $transitions.onSuccess({}, ($transitions)=> {
          var current = $transitions.$to();console.log(current.name);
          if (current.name === 'home') {
               $ctrl.stateBck = 'homebck';
               $ctrl.brandColor = 'black';
          }else {
               $ctrl.stateBck = 'querybck';
               $ctrl.brandColor = 'white';
          }
     })

}]);
