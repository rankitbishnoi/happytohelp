myapp.service('createQ', ['$rootScope','$http', function($rootScope, $http){
     var self= this;


     self.postQuery = (token, subject, description, name, email)=> { // function to send postQuery request to the server with the data
          var data = { subject: subject, description: description, name: name, email: email};
          $http.post('http://localhost:3000/api/createQuery', data,  { headers: {'Authorization': 'Bearer '+ token}}).then(function successCallback(response){
               $rootScope.$broadcast('successfull posted query');
          },function errorCallback(response){
               $rootScope.$broadcast('unsuccessful');
          });
     }

}]);
