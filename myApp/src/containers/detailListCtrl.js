angular.module('savingFood').controller('savingFood.detailListCtrl', detailListCtrl);
detailListCtrl.$inject = ['$scope', '$state', 'dataService', 'dateFormatterService'];
function detailListCtrl($scope, $state, dataService, dateFormatterService){

  var vm = this;

  // Public
  $scope.getReadableDate = getReadableDate;
  $scope.isExpired = dateFormatterService.isExpired;
  $scope.useItem = dataService.useItem;
  $scope.removeItem = dataService.removeItem;
  $scope.trashItems = dataService.trashItems;
  $scope.extendExp = extendExp;
  $scope.getContainerName = dataService.getContainerName;
  $scope.isItemSelected = isItemSelected;
  $scope.selectItem = selectItem;
  $scope.filterByContainerId = filterByContainerId;

  function getReadableDate(date) {
    return dateFormatterService.getReadableDate(date);
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

  function filterByContainerId(item){
    if(item.containerId === $scope.container.$id){
      return true;
    } else {
      return false;
    }
  }

  function extendExp(item){
    dataService.extendExp(item);
    clearSelectedItem();
  }

  $scope.$on("$ionicView.beforeEnter", function() {
    $scope.container = $state.params.container;
    if($scope.container){
      dataService.initItems().then(function(data){
        $scope.itemsDetail = data;
      });
    } else {
      $state.go('tabs.containers');
    }
  });
}
