angular.module('savingFood').controller('savingFood.detailListCtrl', detailListCtrl);
detailListCtrl.$inject = ['$scope', '$state', '$firebaseArray', 'dataService', 'logService', 'dateFormatterService'];
function detailListCtrl($scope, $state, $firebaseArray, dataService, logService, dateFormatterService){

  var vm = this;

  // Public
  $scope.isExpired = dateFormatterService.isExpired;
  $scope.useItem = dataService.useItem;
  $scope.trashItems = dataService.trashItems;

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
