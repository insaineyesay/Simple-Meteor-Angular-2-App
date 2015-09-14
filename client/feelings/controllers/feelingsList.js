angular.module('measure').controller('FeelingsListCtrl', ['$scope', '$meteor', '$rootScope', function ($scope, $meteor, $rootScope) {

  $scope.page = 1;
  $scope.perPage = 10;
  $scope.sort = { title: 1 };
  $scope.orderProperty = '1';

  $scope.$meteorSubscribe('users');

  $scope.feelings = $meteor.collection(function () {
    return Feelings.find({},  {
      sort: $scope.getReactively('sort')
    });
  });

  $meteor.autorun($scope, function () {
    $meteor.subscribe('feelings', {
      limit: parseInt($scope.getReactively('perPage')),
      skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
      sort: $scope.getReactively('sort')
    }, $scope.getReactively('search')).then(function () {
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
      $scope.sort = {title: parseInt($scope.orderProperty)};
    }
  });
  $scope.removeAll = function () {
    $scope.feelings.remove();
  };

  $scope.getUserById = function (userId) {
    return Meteor.users.findOne(userId);
  };

  $scope.creator = function (feeling) {
    if (!feeling) {
      return;
    }

    var owner = $scope.getUserById(feeling.owner);
    if (!owner) {
      return 'nobody';
    }

    if ($rootScope.currentUser) {
      if ($rootScope.currentUser._id) {
        if (owner._id === $rootScope.currentUser._id) {
          return 'me';
        }
      }
    }
    return owner;
  };
}]);
