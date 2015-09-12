Feelings = new Mongo.Collection("feelings");

if (Meteor.isClient) {
    // inject dependencies
    angular.module('measure', ['angular-meteor', 'ui.router']);
    // configure routing
    angular.module('measure').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
      function ($urlRouterProvider, $stateProvider, $locationProvider) {
        // html5 mode true
        $locationProvider.html5Mode(true);
        // routes
        $stateProvider
          .state('feelings', {
            url: '/feelings',
            templateUrl: 'feelings-list.ng.html',
            controller: 'FeelingsListCtrl'
          })
          .state('feelingDetails', {
            url: '/feelings/:feelingId',
            templateUrl: 'feeling-details.ng.html',
            controller: 'FeelingDetailsCtrl'
          });

          // catch all others
          $urlRouterProvider.otherwise('/feelings');
      }]);
    // instantiate controllers
    angular.module('measure').controller('FeelingsListCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
      $scope.feelings = $meteor.collection(Feelings);
      $scope.remove = function (feeling) {
        $scope.feelings.remove(feeling);
      };

      $scope.removeAll = function () {
        $scope.feelings.remove();
      };
    }]);
    angular.module('measure').controller('FeelingDetailsCtrl', ['$scope', '$stateParams', '$meteor',
      function ($scope, $stateParams, $meteor) {
        $scope.feeling = $meteor.object(Feelings, $stateParams.feelingId);
      }
    ]);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Feelings.find().count() === 0) {
      var feelings = [
        {'title': 'Dubstep-Free Zone',
          'description': 'Fast just got faster with Nexus S.'},
        {'title': 'All dubstep all the time',
          'description': 'Get it on!'},
        {'title': 'Savage lounging',
          'description': 'Leisure suit required. And only fiercest manners.'}
      ];
      for (var i = 0; i < feelings.length; i++)
        Feelings.insert(feelings[i]);
    }
  });
}
