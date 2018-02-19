myapp.service('queryCRUD', ['$rootScope','$http', function($rootScope, $http){
     var self =  this;

     self.postAnswer = (token, queryId, msg, name, batch)=> {
          var data = { msg: msg, queryId: queryId, name: name, batch: batch};
          $http.post('http://localhost:3000/api/postAnswer', data,  { headers: {'Authorization': 'Bearer '+ token}}).then(function successCallback(response){
               $rootScope.$broadcast('successfull posted answer');
          },function errorCallback(response){
               $rootScope.$broadcast('unsuccessful');
          });
     }

     self.deleteAnswer = (token, queryId, index) => {
          var data = { queryId: queryId, convoNumber: index};
          $http.post('http://localhost:3000/api/deleteAnswer', data,  { headers: {'Authorization': 'Bearer '+ token}}).then(function successCallback(response){
               $rootScope.$broadcast('successfull deleted answer', index);
          },function errorCallback(response){
               $rootScope.$broadcast('unsuccessful');
          });
     }

     self.deleteQuery = (token, queryId, batch) => {
          var data = { queryId: queryId, batch: batch};
          $http.post('http://localhost:3000/api/deleteQuery', data,  { headers: {'Authorization': 'Bearer '+ token}}).then(function successCallback(response){
               $rootScope.$broadcast('successfull deleted Query');
          },function errorCallback(response){
               $rootScope.$broadcast('unsuccessful');
          });
     }

     self.changeStatus = (token, queryId, status) => {
          var data = { queryId: queryId, status: status};
          $http.post('http://localhost:3000/api/changeStatus', data,  { headers: {'Authorization': 'Bearer '+ token}}).then(function successCallback(response){
               $rootScope.$broadcast('successfull changed status', status);
          },function errorCallback(response){
               $rootScope.$broadcast('unsuccessful');
          });
     }
}]);
