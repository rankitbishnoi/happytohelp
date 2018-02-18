myapp.service('fetchQuery', ['$http', function($http) {
     var self = this;
     self.list = [];
     self.totalQueries = 0;
     self.totalQueryRaised;
     self.resolvedQuery;
     self.totalQuery;
     self.resolved;

     self.queryListAllUsers = (token, status, page) => {
          $http.get('http://localhost:3000/api/getQueryList?count=false&status='+status+'&page='+page, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.list = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.queryListMyself = (token, status, page, email) => {
          $http.get('http://localhost:3000/api/getQueryList?count=false&status='+status+'&page='+page+'&raisedBy=true&email='+email, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.list = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.queryListAllUsersCount = (token, status) => {
          $http.get('http://localhost:3000/api/getQueryList?count=true&status='+status, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.totalQueries = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.TotalQueriesCount = (token) => {
          $http.get('http://localhost:3000/api/getQueryList?count=true', { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.totalQuery = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.queryresolvedCount = (token) => {
          $http.get('http://localhost:3000/api/getQueryList?count=true&resolved=true', { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.resolved = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.queryListMyselfCount = (token, status, email) => {
          var result;
          $http.get('http://localhost:3000/api/getQueryList?count=true&status='+status+'&raisedBy=true&email='+email, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.totalQueries = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.myselfTotalQueriesCount = (token, email) => {
          var result;
          $http.get('http://localhost:3000/api/getQueryList?count=true&total=true&raisedBy=true&email='+email, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.totalQueryRaised = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     };

     self.myselfResolvedQueryCount = (token, email) => {
          var result;
          $http.get('http://localhost:3000/api/getQueryList?count=true&total=true&resolved=true&raisedBy=true&email='+email, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.resolvedQuery = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

}]);
