// configure routing
angular.module('measure').run(['$rootScope', '$location', function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireUser promise is rejected
        // and redirect the user back to the main page
        if (error === "AUTH_REQUIRED") {
            $state.go("/feelings");
        }
    });
}]);
angular.module('measure').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider) {
        // html5 mode true
        $locationProvider.html5Mode(true);
        // routes
        $stateProvider
            .state('feelings', {
                url: '/feelings',
                templateUrl: 'client/feelings/views/feelings-list.ng.html',
                controller: 'FeelingsListCtrl'
            })
            .state('feelingDetails', {
                url: '/feelings/:feelingId',
                templateUrl: 'client/feelings/views/feeling-details.ng.html',
                controller: 'FeelingDetailsCtrl',
                resolve: {
                    "currentUser": ["$meteor", function($meteor) {
                        return $meteor.requireUser();
                    }]
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'client/users/views/login.ng.html',
                controller: 'LoginCtrl',
                controllerAs: 'lc'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'client/users/views/register.ng.html',
                controller: 'RegisterCtrl',
                controllerAs: 'rc'
            })
            .state('resetpw', {
                url: '/resetpw',
                templateUrl: 'client/users/views/reset-password.ng.html',
                controller: 'ResetCtrl',
                controllerAs: 'rpc'
            })
            .state('logout', {
                url: '/logout',
                resolve: {
                    "logout": ['$meteor', '$state', function($meteor, $state) {
                        return $meteor.logout().then(function() {
                            $state.go('feelings');
                        }, function(err) {
                            console.log('logout error - ', err);
                        });
                    }]
                }
            });

        // catch all others
        $urlRouterProvider.otherwise('/feelings');
    }
]);