angular.module('savingFood').controller('savingFood.detailListCtrl', detailListCtrl);
detailListCtrl.$inject = ['$scope', '$state', '$firebaseArray', 'dataService'];
function detailListCtrl($scope, $state, $firebaseArray, dataService){

  var vm = this;

  // Public
  $scope.isExpired = isExpired;
  $scope.hideItem = hideItem;

  $scope.container = $state.params.container;
  if($scope.container){
    var detItemsRef = firebase.database().ref('items').orderByChild("containerId").equalTo($scope.container.$id);
    $scope.itemsDetail = $firebaseArray(detItemsRef);
  }

  function isExpired(item){
    return dataService.isExpired(item);
  }

  function hideItem(itemsDetail, item){
    item.hidden = true;
    itemsDetail.$save(item);
  }
}
