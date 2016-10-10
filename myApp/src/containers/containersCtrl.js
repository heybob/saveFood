angular.module('savingFood').controller('savingFood.containerCtrl', containerCtrl);
containerCtrl.$inject = ['$scope','$ionicModal', '$ionicActionSheet', '$rootScope', '$state', 'dataService'];
function containerCtrl($scope, $ionicModal, $ionicActionSheet, $rootScope, $state, dataService) {

  //Public Methods
  $scope.addContainer = addContainer;
  $scope.removeContainer = removeContainer;
  $scope.openAddContainerModal =  openAddContainerModal;
  $scope.closeAddContainerModal = closeAddContainerModal;
  $scope.toggleEditMode = toggleEditMode;

  $scope.$on("$ionicView.beforeEnter", function() {
    if(!$rootScope.user){
      $state.go('login');
    }
  });

  dataService.initContainers().then(function(data){
    $scope.containers = data;
  });

  //variables
  var hideSheet;
  $scope.form = {};
  $scope.containerOptions = [
    {name: 'Fridge', value: 'Fridge'},
    {name: 'Freezer', value: 'Freezer'}
  ];
  $scope.modalProps = {
    buttonName: undefined,
    executeFn: null,
    container: null
  };
  $scope.editMode = false;

  function removeContainer(container) {
    var con = container;
    var deleteFn = function(){deleteContainer.call(this,container); hideSheet()};
    showDeleteConfirmation(deleteFn, container);
  }
  function deleteContainer(container){
    $scope.containers.$remove(container);
  }
  function addContainer() {
    var container = {
      name: $scope.form.name,
      type: $scope.form.type.value,
      owner: $rootScope.user.uid
    };
    firebase.database().ref('containers').push(container);
    $scope.closeAddContainerModal();
  }

  function updateContainer(container){
    container.name = $scope.form.name;
    container.type = $scope.form.type.value;
    $scope.containers.$save(container);
    $scope.closeAddContainerModal();

  }

  function clearForm(){
    $scope.form.name = undefined;
    $scope.form.type = $scope.containerOptions[0];
  }

  $ionicModal.fromTemplateUrl('templates/containers/addContainerModal.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.containerModal = modal;
  });
  function openAddContainerModal(container) {
    if(!container) { // implied Add
      $scope.modalProps = {
        buttonName: 'Add',
        executeFn: addContainer
      };
    } else {
      $scope.modalProps = {
        buttonName: 'Update',
        executeFn: updateContainer,
        container: container
      };
      $scope.form.name = container.name;
      if(container.type === 'Fridge'){
        $scope.form.type = $scope.containerOptions[0];
      } else {
        $scope.form.type = $scope.containerOptions[1];
      }
    }
    $scope.containerModal.show();
  }

  function closeAddContainerModal() {
    clearForm();
    $scope.containerModal.hide();
  }

  function toggleEditMode(){
    $scope.editMode = !$scope.editMode;
  }

  //======= Action Sheet ========/
  function showDeleteConfirmation(action, container) {

    // Show the action sheet
    hideSheet = $ionicActionSheet.show({
      destructiveText: 'Delete',
      titleText: 'Delete ' + container.name +' and it\'s contents?',
      cancelText: 'Cancel',
      cancel: function() {
        hideSheet();
      },
      destructiveButtonClicked: action
    });
  }

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    clearForm();
    $scope.containerModal.remove();

  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
}
