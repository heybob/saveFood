angular.module('savingFood').controller('savingFood.detailListCtrl', detailListCtrl);
detailListCtrl.$inject = ['$scope', '$state', '$firebaseArray', 'dataService', 'logService'];
function detailListCtrl($scope, $state, $firebaseArray, dataService, logService){

  var vm = this;

  // Public
  $scope.isExpired = isExpired;
  $scope.useItem = useItem;

  $scope.container = $state.params.container;
  if($scope.container){
    dataService.initItems().then(function(data){
      $scope.itemsDetail = data;
    });
  }

  function useItem(collection, item){
    if(item.servings > 1){
      logService.add(logService.createLogEntryFromItem(item));
      item.servings -= 1;
      collection.$save(item);
    } else {
      logService.add(logService.createLogEntryFromItem(item));
      collection.$remove(item);
    }
  }

  function isExpired(item){
    return dataService.isExpired(item);
  }
}
