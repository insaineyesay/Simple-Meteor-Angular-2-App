angular.module('measure').controller('FeelingDetailsCtrl', ['$scope', '$stateParams', '$meteor',
    function($scope, $stateParams, $meteor) {
        
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

        $scope.canInvite = function() {
            if (!$scope.feeling)
                return false;

            return !$scope.feeling.public &&
                $scope.feeling.owner === Meteor.userId();
        };

        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 8,
            events: {
                click: function(mapModel, eventName, originalEventArgs) {
                    if (!$scope.feeling)
                        return;

                    if (!$scope.feeling.location)
                        $scope.feeling.location = {};

                    $scope.feeling.location.latitude = originalEventArgs[0].latLng.lat();
                    $scope.feeling.location.longitude = originalEventArgs[0].latLng.lng();
                    //scope apply required because this event handler is outside of the angular domain
                    $scope.$apply();
                }
            },
            marker: {
                options: {
                    draggable: true
                },
                events: {
                    dragend: function(marker, eventName, args) {
                        if (!$scope.feeling.location)
                            $scope.feeling.location = {};

                        $scope.feeling.location.latitude = marker.getPosition().lat();
                        $scope.feeling.location.longitude = marker.getPosition().lng();
                    }
                }
            }
        };

        $scope.save = function() {
            $scope.feeling.save()
                .then(function(numberOfDocs) {
                    console.log('save success doc affected ', numberOfDocs);
                }, function(error) {
                    console.log('save error', error);
                });
        };
        $scope.reset = function() {
            $scope.feeling.reset();
        };
    }
]);