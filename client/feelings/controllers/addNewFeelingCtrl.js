angular.module('measure')
    .controller("addNewFeelingCtrl", [
        '$scope',
        '$meteor',
        '$rootScope',
        '$state',
        '$mdDialog',
        'feelings',
        function($scope, $meteor, $rootScope, $state, $mdDialog, feelings) {
            $scope.newFeeling = {};
            $scope.addNewFeeling = function () {
            if ($scope.newFeeling.name) {
                $scope.newFeeling.owner = $rootScope.currentUser._id;
                feelings.push($scope.newFeeling);
                $scope.newFeeling = '';
                $mdDialog.hide();
            }
        }

        $scope.close = function() {
            $mdDialog.hide();
        }
    }]);