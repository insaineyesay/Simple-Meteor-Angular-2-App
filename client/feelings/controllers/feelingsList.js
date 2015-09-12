angular.module('measure').controller('FeelingsListCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
  $scope.feelings = $meteor.collection(Feelings).subscribe('feelings');
  $scope.remove = function (feeling) {
    $scope.feelings.remove(feeling);
  };

  $scope.removeAll = function () {
    $scope.feelings.remove();
  };
}]);
