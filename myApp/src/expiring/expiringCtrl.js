angular.module('savingFood').controller('savingFood.expiringCtrl', expiringCtrl);

expiringCtrl.$inject = ['$scope', 'logService', 'dateFormatterService', '$rootScope', '$state','dataService'];

function expiringCtrl($scope, logService, dateFormatterService, $rootScope, $state, dataService){

  //Api
  $scope.getReadableDate = getReadableDate;
  $scope.useItem = dataService.useItem;
  $scope.notExpired = notExpired;
  $scope.isItemSelected = isItemSelected;
  $scope.selectItem = selectItem;
  $scope.removeItem = dataService.removeItem;
  $scope.trashItems = dataService.trashItems;
  $scope.extendExp = extendExp;
  $scope.getContainerName = dataService.getContainerName;



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
    //return item.expDate >= dateFormatterService.getToday().getTime();
    return true;
  }

  function isItemSelected(item){
    if($scope.selected && item.$id === $scope.selected.$id){
      return true;
    }
    return false;
  }
  function selectItem(item) {
    if($scope.selected && item.$id === $scope.selected.$id){
      clearSelectedItem();
    } else {
      $scope.selected = item;
    }
  }

  function clearSelectedItem(){
    $scope.selected = null;
  }

  function extendExp(item){
    dataService.extendExp(item);
    clearSelectedItem();
  }

}
