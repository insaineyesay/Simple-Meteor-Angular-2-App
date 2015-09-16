angular.module('measure').controller('FeelingDetailsCtrl', ['$scope', '$stateParams', '$meteor',
  function ($scope, $stateParams, $meteor) {
    $scope.feeling = $meteor.object(Feelings, $stateParams.feelingId);
    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
    $scope.$meteorSubscribe('feelings');
    $scope.invite = function (user) {
      $meteor.call('invite', $scope.feeling._id, user._id).then(
        function (data) {
          console.log('success inviting', data);
        },
        function (err) {
          console.log('failed', err);
        }
      );
    };

    $scope.canInvite = function (){
      if (!$scope.party)
        return false;

      return !$scope.party.public &&
        $scope.party.owner === Meteor.userId();
    };
    
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
