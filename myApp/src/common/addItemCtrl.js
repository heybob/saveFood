angular.module('savingFood').controller('savingFood.addItemCtrl', addItemCtrl);
addItemCtrl.$inject = ['$scope', '$ionicModal', 'dateFormatterService', '$rootScope', 'dataService', 'Auth'];

function addItemCtrl($scope, $ionicModal, dateFormatterService, $rootScope, dataService, Auth){

  $scope.openAddItemModal = openAddItemModal;
  $scope.closeAddItemModal = closeAddItemModal;
  $scope.addItem = addItem;

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
