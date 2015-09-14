angular.module('measure').filter('uninvited', function () {
  return function (users, feeling) {
    if (!feeling) {
      return false;
    }
    return _.filter(users, function (user) {
      if (user._id == feeling.owner || _.contains(feeling.uninvited, user._id)) {
        return false;
      } else {
        return true;
      }
    });
  }
});
