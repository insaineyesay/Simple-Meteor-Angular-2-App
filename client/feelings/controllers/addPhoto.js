angular.module("measure").controller("AddPhotoCtrl", ['$scope', '$meteor', '$rootScope', '$state', '$mdDialog',
    function($scope, $meteor, $rootScope, $state, $mdDialog) {
        $scope.addImages = function(files) {
            if (files.length > 0) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    $scope.$apply(function() {
                        $scope.imgSrc = e.target.result;
                        $scope.myCroppedImage = '';
                    });
                };

                reader.readAsDataURL(files[0]);
            } else {
                $scope.imgSrc = undefined;
            }
        };

        $scope.saveCroppedImage = function() {
            if ($scope.myCroppedImage !== '') {
                $scope.images.save($scope.myCroppedImage).then(function(result) {
                    $scope.newEntryImages.push(result[0]._id);
                    $scope.imgSrc = undefined;
                    $scope.myCroppedImage = '';
                });
            }
        };

        $scope.close = $mdDialog.hide;
    }
]);