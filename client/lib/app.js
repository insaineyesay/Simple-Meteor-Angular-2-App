// inject dependencies
angular.module('measure', ['angular-meteor', 'ui.router', 'angularUtils.directives.dirPagination']);

function onReady () {
  angular.bootstrap(document, ['measure']);
}

if (Meteor.isCordova) {
  angular.elment(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
