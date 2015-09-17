// inject dependencies
angular.module('measure', [
	'angular-meteor',
	'ui.router',
	'angularUtils.directives.dirPagination',
	'uiGmapgoogle-maps'
	]);

function onReady () {
  angular.bootstrap(document, ['measure']);
}

if (Meteor.isCordova) {
  angular.elment(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
