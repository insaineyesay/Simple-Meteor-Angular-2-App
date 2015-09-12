// configure routing
angular.module('measure').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function ($urlRouterProvider, $stateProvider, $locationProvider) {
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
        controller: 'FeelingDetailsCtrl'
      });

      // catch all others
      $urlRouterProvider.otherwise('/feelings');
  }]);
