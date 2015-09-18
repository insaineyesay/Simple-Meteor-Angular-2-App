angular.module('measure').controller('FeelingsListCtrl', [
    '$scope',
    '$meteor',
    '$rootScope',
    '$state',
    '$mdDialog',

    function($scope, $meteor, $rootScope, $state, $mdDialog) {

        $scope.page = 1;
        $scope.perPage = 10;
        $scope.sort = {
            title: 1
        };
        $scope.orderProperty = '1';

        $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

        $scope.feelings = $meteor.collection(function() {
            return Feelings.find({}, {
                sort: $scope.getReactively('sort')
            });
        });

        $meteor.autorun($scope, function() {
            $meteor.subscribe('feelings', {
                limit: parseInt($scope.getReactively('perPage')),
                skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
                sort: $scope.getReactively('sort')
            }, $scope.getReactively('search')).then(function() {
                $scope.feelingsCount = $meteor.object(Counts, 'numberOfFeelings', false);
                $scope.feelings.forEach(function(feeling) {
                    feeling.onClicked = function() {
                        $state.go('feelingDetails', {
                            feelingId: feeling._id
                        });
                    };
                });

                var styles1 = [{
                    "featureType": "landscape.natural",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "visibility": "on"
                    }, {
                        "color": "#e0efef"
                    }]
                }, {
                    "featureType": "poi",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "visibility": "on"
                    }, {
                        "hue": "#1900ff"
                    }, {
                        "color": "#c0e8e8"
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "lightness": 100
                    }, {
                        "visibility": "simplified"
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "on"
                    }, {
                        "lightness": 700
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{
                        "color": "#7dcdcd"
                    }]
                }];
                var styles2 = [{
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#444444"
                    }]
                }, {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{
                        "color": "#f2f2f2"
                    }]
                }, {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{
                        "saturation": -100
                    }, {
                        "lightness": 45
                    }]
                }, {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "simplified"
                    }]
                }, {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{
                        "color": "#46bcec"
                    }, {
                        "visibility": "on"
                    }]
                }];

                $scope.map = {
                    center: {
                        latitude: 45,
                        longitude: -73
                    },
                    options: {
                        styles: styles2,
                        maxZoom: 10
                    },
                    zoom: 8
                };
            });
        });

        $scope.remove = function(feeling) {
            $scope.feelings.remove(feeling);
        };

        $scope.pageChanged = function(newPage) {
            $scope.page = newPage;
        };

        $scope.$watch('orderProperty', function() {
            if ($scope.orderProperty) {
                $scope.sort = {
                    title: parseInt($scope.orderProperty)
                };
            }
        });

        $scope.openAddNewFeelingModal = function() {
                $mdDialog.show({
                clickOutsideToClose: true,
                templateUrl: 'client/feelings/views/add-new-feeling-modal.ng.html',
                controller: 'addNewFeelingCtrl',
                resolve: {
                    feelings: function() {
                        return $scope.feelings;
                    }
                }
            }).then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        $scope.isRSVP = function(rsvp, feeling) {
            if (!$rootScope.currentUser._id) return false;
            var rsvpIndex = feeling.myRsvpIndex;
            rsvpIndex = rsvpIndex || _.indexOf(_.pluck(feeling.rsvps, 'user'), $rootScope.currentUser._id);

            if (rsvpIndex !== -1) {
                feeling.myRsvpIndex = rsvpIndex;
                return feeling.rsvps[rsvpIndex].rsvp === rsvp;
            }
        }

        $scope.rsvp = function(feelingId, rsvp) {
            $meteor.call('rsvp', feelingId, rsvp).then(
                function(data) {
                    console.log('succes responding', data);
                },
                function(err) {
                    console.log('failed', err);
                }
            );
        };

        $scope.outstandingInvitations = function(feeling) {
            return _.filter($scope.users, function(user) {
                return (_.contains(feeling.invited, user._id) &&
                    !_.findWhere(feeling.rsvps, {
                        user: user._id
                    }));
            });
        };
        $scope.removeAll = function() {
            $scope.feelings.remove();
        };

        $scope.getUserById = function(userId) {
            return Meteor.users.findOne(userId);
        };

        $scope.creator = function(feeling) {
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
    }
]);