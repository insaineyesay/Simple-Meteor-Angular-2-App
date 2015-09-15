angular.module('measure').controller('FeelingsListCtrl', ['$scope', '$meteor', '$rootScope', function ($scope, $meteor, $rootScope) {

  $scope.page = 1;
  $scope.perPage = 10;
  $scope.sort = { title: 1 };
  $scope.orderProperty = '1';

  $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

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

  $scope.rsvp = function (feelingId, rsvp) {
    $meteor.call('rsvp', feelingId, rsvp).then(
      function(data) {
        console.log('succes responding', data);
      },
      function (err) {
        console.log('failed', err);
      }
    );
  };
  $scope.outstandingInvitations = function (feeling) {
      return _.filter($scope.users, function (user) {
        return (_.contains(feeling.invited, user._id) &&
        !_.findWhere(feeling.rsvps, {user: user._id}));
      });
    };
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
