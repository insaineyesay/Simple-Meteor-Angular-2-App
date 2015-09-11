if (Meteor.isClient) {
  angular.module('measure', ['angular-meteor']);
  angular.module('measure').controller('MeasureCtrl', ['$scope', function ($scope) {
    $scope.parties = [
      {
        'name': 'Dubstep-Free Zone',
        'description': 'Can we please just for an evening not listen to dubstep.'
      },
      {
        'name': 'All dubstep all the time',
        'description': 'Get it on!'
      },
      {
        'name': 'Savage lounging',
        'description': 'Leisure suit required. And only fiercest manners.'
      }
    ];
  }])
}
