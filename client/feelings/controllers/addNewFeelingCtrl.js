angular.module('measure')
    .controller("addNewFeelingCtrl", [
        '$scope',
        '$meteor',
        '$rootScope',
        '$state',
        '$modalInstance',
        'feelings',
        function($scope, $meteor, $rootScope, $state, $modalInstance, feelings) {
            $scope.addNewFeeling = function() {
                $scope.newFeeling.owner = $rootScope.currentUser._id;
                feelings.push($scope.newFeeling);
                $scope.newFeeling = '';
                $modalInstance.close();
            };
        }
    ]);