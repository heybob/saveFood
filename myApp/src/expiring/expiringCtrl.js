angular.module('savingFood').controller('savingFood.expiringCtrl', expiringCtrl);

expiringCtrl.$inject = ['$scope', 'logService', 'dateFormatterService', '$rootScope', '$state','dataService'];

function expiringCtrl($scope, logService, dateFormatterService, $rootScope, $state, dataService){

  //Api
  $scope.getReadableDate = getReadableDate;
  $scope.useItem = dataService.useItem;
  $scope.notExpired = notExpired;



  $scope.$on("$ionicView.beforeEnter", function() {
    dataService.initItems().then(function(data){
      $scope.items = data;
    });

    dataService.initContainers().then(function(data){
      $scope.containers = data;
    });
  });

  function getReadableDate(date) {
    return dateFormatterService.getReadableDate(date);
  }

  function notExpired(item) {
    return item.expDate >= dateFormatterService.getToday().getTime();
  }


}
