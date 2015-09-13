angular.module('measure').controller('FeelingsListCtrl', ['$scope', '$meteor', function ($scope, $meteor) {

  $scope.page = 1;
  $scope.perPage = 10;
  $scope.sort = { name: 1 };
  $scope.orderProperty = '1';

  $scope.feelings = $meteor.collection(function () {
    return Feelings.find({},  {
      sort: $scope.getReactively('sort')
    });
  });

  $meteor.autorun($scope, function () {
    $meteor.subscribe('feelings', {
      limit: parseInt($scope.getReactively('perPage')),
      skip: parseInt($scope.getReactively('page') - 1) * parseInt($scope.getReactively('perPage')),
      sort: $scope.sort
    }).then(function (feeling) {
      $scope.feelingsCount = $meteor.object(Counts, 'numberOfFeelings', false);
    });
  });

  $scope.remove = function (feeling) {
    $scope.feelings.remove(feeling);
  };

  $scope.pageChanged = function (newPage) {
    $scope.page = newPage;
  };

  $scope.$watch('orderProperty', function () {
    if ($scope.orderProperty) {
      $scope.sort = {name: parseInt($scope.orderProperty)};
    }
  });
  $scope.removeAll = function () {
    $scope.feelings.remove();
  };
}]);
