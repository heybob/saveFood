angular.module('savingFood').controller('savingFood.homeCtrl', homeCtrl);
homeCtrl.$inject = ['$scope', '$firebaseArray', '$firebaseObject', '$state', '$ionicModal', 'dateFormatterService', 'dataService'];
function homeCtrl($scope, $firebaseArray, $firebaseObject, $state, $ionicModal, dateFormatterService, dataService){

  // API
  $scope.openAddItemModal = openAddItemModal;
  $scope.closeAddItemModal = closeAddItemModal;
  $scope.getReadableDate = getReadableDate;
  $scope.useItem = useItem;
  $scope.addItem = addItem;
  $scope.notExpired = notExpired;

  var containersRef = firebase.database().ref('containers');
  $scope.containers = $firebaseArray(containersRef);
  $scope.containers.$loaded().then(function(data){
    $scope.form.container = data[0];
    console.log(data);
  });

  var itemsRef = firebase.database().ref('items');
  //var itemsRef = firebase.database().ref('items').orderByChild("containerId").equalTo('-KRRn0YLqe1jTIfQ1XRf');
  $scope.items = dataService.getAllItems();


  //create a temporary user
  $scope.user = {
    id: 'bfiliczkowski',
    firstName: 'Bob',
    lastName: 'Filiczkowski',
    email: 'bfiliczkowski@gmail.com',
    password: 'heybob' // need to obfuscate this.
  };

  $scope.form = {};
  $scope.addItemModalProps = {
    buttonName: 'Add',
    executeFn: addItem,
    item: null
  };

  $ionicModal.fromTemplateUrl('templates/addItem/addItem.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.itemModal = modal;
  });

  function openAddItemModal(id, item) {
    $scope.form.container = $scope.containers[0];
    $scope.itemModal.show();
  }

  function closeAddItemModal() {
    resetAddItemForm();
    $scope.itemModal.hide();
  }

  function resetAddItemForm(){
    $scope.form = {};
  }

  function addItem(){
    var containerId = $scope.form.container.$id;
    var item = {
      name: $scope.form.name,
      servings: $scope.form.servings,
      expiresIn: $scope.form.expires,
      containerId: containerId,
      addedDate: firebase.database.ServerValue.TIMESTAMP,
      expDate: new Date(Date.now() + $scope.form.expires * dateFormatterService.ONE_DAY_MILLI).getTime()
    };
    firebase.database().ref('items').push(item);
    $scope.$broadcast('itemAdded');
    closeAddItemModal();
  }

  function useItem(collection, item){
    if(item.servings > 1){
      item.servings -= 1;
      collection.$save(item);
    } else {
      collection.$remove(item);
    }
  }
  function getReadableDate(date) {
    return dateFormatterService.getReadableDate(date);
  }

  function notExpired(item) {
    return item.expDate >= dateFormatterService.getToday().getTime();
  }
}
