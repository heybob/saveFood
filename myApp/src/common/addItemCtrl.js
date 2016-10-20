angular.module('savingFood').controller('savingFood.addItemCtrl', addItemCtrl);
addItemCtrl.$inject = ['$scope', '$ionicModal', 'dateFormatterService', 'dataService', 'Auth', '$state'];

function addItemCtrl($scope, $ionicModal, dateFormatterService, dataService, Auth, $state){

  $scope.openAddItemModal = openAddItemModal;
  $scope.closeAddItemModal = closeAddItemModal;
  $scope.addItem = addItem;
  $scope.isAddVisible = isAddVisible;
  $scope.item = undefined;

  $scope.addItemModalProps = {
    buttonName: 'Add',
    executeFn: addItem,
    item: null
  };

  $scope.form = {};

  $ionicModal.fromTemplateUrl('templates/addItem/addItem.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.itemModal = modal;
  });
  function isAddVisible(){
    if($state.current && ($state.current.name === 'login' || $state.current.name === 'register' || $state.current.name === '')) {
      return false;
    }
    return true;
  }
  function openAddItemModal(item) {
    dataService.initContainers().then(function(data){
      $scope.containers = data;
      if(item){
        $scope.form.name = item.name;
        $scope.form.expires = item.expiresIn;
        $scope.form.servings = item.servings;
      }
      $scope.item = item;
      $scope.form.container = $scope.containers[0];
      $scope.itemModal.show();
    });
  }

  function closeAddItemModal() {
    resetAddItemForm();
    $scope.itemModal.hide();
  }

  function resetAddItemForm(){
    $scope.item = undefined;
    $scope.form = {};
  }

  function addItem(){
    if($scope.item){
      dataService.updateItem(updateItemProperties($scope.item));
    } else {
      dataService.addItem(getItemProperties());
    }
    closeAddItemModal();
  }

  function getItemProperties(item){
    var uid = Auth.$getAuth().uid;
    var containerId = $scope.form.container.$id;
    // Add new item
    var newItem = {
      name: $scope.form.name,
      servings: $scope.form.servings,
      expiresIn: $scope.form.expires,
      containerId: containerId,
      addedDate: firebase.database.ServerValue.TIMESTAMP,
      expDate: new Date(Date.now() + $scope.form.expires * dateFormatterService.ONE_DAY_MILLI).getTime(),
      owner: uid
    };
    return newItem;
  }

  function updateItemProperties(item){
    var uid = Auth.$getAuth().uid;
    var containerId = $scope.form.container.$id;
    var oldExpIn = item.expiresIn;
    //Update the current item
    item.name = $scope.form.name;
    item.expiresIn = $scope.form.expires;
    item.servings = $scope.form.servings;
    item.containerId = containerId;
    item.expDate += ($scope.form.expires - oldExpIn) * dateFormatterService.ONE_DAY_MILLI;
    return item;
  }

}
