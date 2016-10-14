angular.module('savingFood').controller('savingFood.addItemCtrl', addItemCtrl);
addItemCtrl.$inject = ['$scope', '$ionicModal', 'dateFormatterService', '$rootScope', 'dataService', 'Auth', '$state'];

function addItemCtrl($scope, $ionicModal, dateFormatterService, $rootScope, dataService, Auth, $state){

  $scope.openAddItemModal = openAddItemModal;
  $scope.closeAddItemModal = closeAddItemModal;
  $scope.addItem = addItem;
  $scope.isAddVisible = isAddVisible;

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
    if($state.current.name === 'login' || $state.current.name === 'register' || $state.current.name === '') {
      return false;
    }
    return true;
  }
  function openAddItemModal(id, item) {
    dataService.initContainers().then(function(data){
      $scope.containers = data;
      $scope.form.container = $scope.containers[0];
      $scope.itemModal.show();
    });
  }

  function closeAddItemModal() {
    resetAddItemForm();
    $scope.itemModal.hide();
  }

  function resetAddItemForm(){
    $scope.form = {};
  }

  function addItem(){
    var uid = Auth.$getAuth().uid;
    var containerId = $scope.form.container.$id;
    var item = {
      name: $scope.form.name,
      servings: $scope.form.servings,
      expiresIn: $scope.form.expires,
      containerId: containerId,
      addedDate: firebase.database.ServerValue.TIMESTAMP,
      expDate: new Date(Date.now() + $scope.form.expires * dateFormatterService.ONE_DAY_MILLI).getTime(),
      owner: uid
    };
    firebase.database().ref('items').push(item);
    $scope.$broadcast('itemAdded');
    closeAddItemModal();
  }
}
