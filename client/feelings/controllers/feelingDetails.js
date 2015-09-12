angular.module('measure').controller('FeelingDetailsCtrl', ['$scope', '$stateParams', '$meteor',
  function ($scope, $stateParams, $meteor) {
    $scope.feeling = $meteor.object(Feelings, $stateParams.feelingId, false);
    $scope.save = function () {
      $scope.feeling.save()
        .then(function (numberOfDocs) {
          console.log('save success doc affected ', numberOfDocs);
        }, function (error) {
          console.log('save error', error);
        });
    };
    $scope.reset = function () {
      $scope.feeling.reset();
    };
  }
]);
