angular.module('savingFood').controller('savingFood.detailListCtrl', detailListCtrl);
detailListCtrl.$inject = ['$scope', '$state', '$firebaseArray'];
function detailListCtrl($scope, $state, $firebaseArray){

  $scope.container = $state.params.container;
  if($scope.container){
    var detItemsRef = firebase.database().ref('items').orderByChild("containerId").equalTo($scope.container.$id);
    $scope.itemsDetail = $firebaseArray(detItemsRef);
  }
}
