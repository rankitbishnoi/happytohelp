myapp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES
        .state('home', {
            url: '/home',
            templateUrl: './angular/views/home.html'
        })
        //QUERY STATE
        .state('query', {
            url: '/query',
            templateUrl: './angular/views/query.html',
            controller: 'queryCtrl',
            controllerAs: 'query'
        })

        .state('queryId', {
            url: '/queryId',
            templateUrl: './angular/views/singleQuery.html',
            controller: 'singleQueryCtrl',
            controllerAs: 'singleQuery'
        })

        .state('createQuery', {
            url: '/createQuery',
            templateUrl: './angular/views/createQuery.html',
            controller: 'createQueryCtrl',
            controllerAs: 'createQuery'
        })
    }]);
