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
            $scope.images = $meteor.collectionFS(Images, false, Images);
            $scope.newEntryImages = [];

            $scope.addNewFeeling = function () {
            if ($scope.newFeeling.title) {
                $scope.newFeeling.owner = $rootScope.currentUser._id;

                // Link the images and the order to the new entry
                if ($scope.newEntryImages && $scope.newEntryImages.length > 0) {
                    $scope.newFeeling.images = [];

                    angular.forEach($scope.newEntryImages, function (image) {
                        $scope.newFeeling.images.push({id: image._id});
                    });
                }
                
                // Save the party
                feelings.push($scope.newFeeling);

                // Reset the form
                $scope.newEntryImages = [];
                $scope.newFeeling = {};
                $mdDialog.hide();
            }
        };

        $scope.close = function() {
            $mdDialog.hide();
        };

        $scope.updateDescription = function ($data, image) {
            image.update({$set: {'metadata.description': $data}});
        };
    }]);