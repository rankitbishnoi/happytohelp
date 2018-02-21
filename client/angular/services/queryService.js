myapp.service('fetchQuery', ['$http', function($http) {
     var self = this;
     self.list = [];
     self.totalQueries = 0;
     self.totalQueryRaised;
     self.resolvedQuery;
     self.totalQuery;
     self.resolved;

     self.queryListAllUsers = (token, status, page) => { // function to send request to server to get query list for all users with filter status specified
          $http.get('http://localhost:3000/api/getQueryList?count=false&status='+status+'&page='+page, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.list = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.queryListMyself = (token, status, page, email) => { // function to send request to server to get query list raised by the user loggedin with filter status specified
          $http.get('http://localhost:3000/api/getQueryList?count=false&status='+status+'&page='+page+'&raisedBy=true&email='+email, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.list = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.queryListAllUsersCount = (token, status) => { // function to send request to server to get query total count for all users with filter status specified
          $http.get('http://localhost:3000/api/getQueryList?count=true&status='+status, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.totalQueries = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.TotalQueriesCount = (token) => {   // function to send request to server to get query total count for all users without any filter
          $http.get('http://localhost:3000/api/getQueryList?count=true', { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.totalQuery = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.queryresolvedCount = (token) => { // function to send request to server to get query total count for all users  that has been resolved
          $http.get('http://localhost:3000/api/getQueryList?count=true&resolved=true', { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.resolved = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.queryListMyselfCount = (token, status, email) => { // function to send request to server to get query(raised by the user logged in) total count  with the filter status specified
          var result;
          $http.get('http://localhost:3000/api/getQueryList?count=true&status='+status+'&raisedBy=true&email='+email, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.totalQueries = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.myselfTotalQueriesCount = (token, email) => { // function to send request to server to get query(raised by the user logged in) total count  without any filter specified
          var result;
          $http.get('http://localhost:3000/api/getQueryList?count=true&total=true&raisedBy=true&email='+email, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.totalQueryRaised = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     };

     self.myselfResolvedQueryCount = (token, email) => {   // function to send request to server to get query(raised by the user logged in) total count  that has been resolved
          var result;
          $http.get('http://localhost:3000/api/getQueryList?count=true&total=true&resolved=true&raisedBy=true&email='+email, { headers: {'Authorization': 'Bearer '+ token}}).then( function successCallback(response){
               self.resolvedQuery = response.data;
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

}]);
