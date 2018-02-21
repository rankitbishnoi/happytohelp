myapp.controller('loginCtrl',['$uibModal','$log','$document','$http','$localStorage','$state','$transitions', function ($uibModal, $log, $document, $http, $localStorage, $state, $transitions) {
     var $ctrl = this;

     $ctrl.logoutbtn = false;         // variable used to decide that the logout button should be visible or not, which is initally false(user not loged in)
     $ctrl.loginbtn = true;           // variable used to decide that the logout button should be visible or not, which is initally true(user not loged in)

     $ctrl.parseJwt = (token) => {            // function to decode the tokem in local storage
          try {
               return JSON.parse(atob(token.split('.')[1]));
          } catch (e) {
               return null;
          }
     };

     if($localStorage.token != undefined) {         // function to decide that the user is provided with login functionallity if he/she is not logged in yet on the basis of the token stored in localStorage
                                                      // or he/she should be provide with logout functionality, if he/she is already logged in
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
     $ctrl.logout = () => {                                 // function to provide the functionality of logout, this will delete the token stored in localstorage and provide the user with login functionality again
          $localStorage.token = undefined;
          $ctrl.loginbtn = true;
          $ctrl.logoutbtn = false;
          $state.go('home');
     }

     if ($ctrl.loginbtn === true) {                             // this condition decides if the letsGetStarted btn should be provide with login functionality or direct user to query page if user is logged in already
          $ctrl.letsGetStarted = ()=> { $ctrl.login();}
     }else {
          $ctrl.letsGetStarted = ()=> { $state.go('query');}
     }

     $ctrl.animationsEnabled = true;               // variable to decide that the login and register modal should come/go with animation or not

     $ctrl.login = function (size, parentSelector) {             // function to open the login modal
          $uibModal.open({
               animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title-bottom',
               ariaDescribedBy: 'modal-body-bottom',
               templateUrl: 'login.html',
               size: 'md',
               controller: function($scope,$uibModalInstance,$localStorage,$state) {      // modal controller

                    $scope.loginNow = function (){              // function will intitate the login process
                         $scope.error = undefined;             // varibale to hold the login error, which is initally undefined.
                         if ($scope.lemail === 'Email' || $scope.lpassword === 'password' || $scope.lemail === null || $scope.lpassword === null || $scope.lemail === undefined || $scope.lpassword === undefined ){         // condition to deterkine if all the requires inputs are there or not
                              $scope.error = 'Please enter valid Email id and password.';
                              $scope.lemail = '';
                              $scope.lpassword = '';
                         } else {
                              var data = { email: $scope.lemail, password: $scope.lpassword};
                              $http.post('http://localhost:3000/api/login', data).then(function successCallback(response){     // http request to the server to login
                                   if (response.status === 200) {              // condition to see if the request is successfull or not
                                        $localStorage.token=response.data.token;                             // to store the token provided by the server
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

                    $scope.register = () => {                            // function to close the login modal and call the register odal
                         $uibModalInstance.close();
                         $ctrl.register();
                    }

                    $scope.ok = () => {                                      // function to close the modal
                         $uibModalInstance.close();
                    };
               }
          }).result.catch(function (resp) {                                       // to stop all the error like clicking outside the modal area on screen
               if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
          });
     };

     $ctrl.register = function (size, parentSelector) {             // function to open the register modal
          $uibModal.open({
               animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title-bottom',
               ariaDescribedBy: 'modal-body-bottom',
               templateUrl: 'register.html',
               size: 'md',
               controller: function($scope,$uibModalInstance,$localStorage,$state) {      // modal controller

                    $scope.registerNow = function () {                             // function to initiate the registerring process
                         var letters = /^[A-Za-z]+$/;                              // reges to check if only letters are present
                         var letterNumber = /^[0-9a-zA-Z]+$/;                        // reges to see if only letters and numbers are present
                         var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;         // reges to see if it is a valid emailid
                         var mobile = /^(\+[\d]{1,3}|0)?[7-9]\d{9}$/;                  // reges to see if the varibale is valid mobile number
                         var number = /[0-9]/;                               // regex to see if there is one numbers in variable
                         var lowercase = /[a-z]/;                           // regex to see if the letters provided have at least one lowercase
                         var uppercase = /[A-Z]/;                                // regex to see if the letters provided have at least one uppercase
                         $scope.rerror = undefined;                             // all the possible error that can arise during register process
                         $scope.nameerror = undefined;
                         $scope.usernameerror = undefined;
                         $scope.emailerror = undefined;
                         $scope.passworderror = undefined;
                         $scope.confirmpassworderror = undefined;
                         $scope.mobileNumbererror = undefined;
                         if ($scope.email === ' ' || $scope.password === ' ' || $scope.name === ' ' || $scope.username === ' ' || $scope.mobileNumber === ' '){       // condition to see all the error that con arrise and store them in error varibles accordingly
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
                              };                                            // http request to the server for registering with appropriate data
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
          }).result.catch(function (resp) {                                      // to stop all the error like clicking outside the modal area on screen
               if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
          });
     };

     $ctrl.stateBck = 'homebck';                               // intital body background class

     $transitions.onSuccess({}, ($transitions)=> {                   // to catch the successfull transition of state and change the background class of the body
          var current = $transitions.$to();
          if (current.name === 'home') {
               $ctrl.stateBck = 'homebck';
               $ctrl.brandColor = 'black';
          }else {
               $ctrl.stateBck = 'querybck';
               $ctrl.brandColor = 'white';
          }
     })

}]);
