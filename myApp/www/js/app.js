// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDkT1Ozv1WFOVPG18AJylS7rsIxj46fjZc",
    authDomain: "save-food-cba1b.firebaseapp.com",
    databaseURL: "https://save-food-cba1b.firebaseio.com",
    storageBucket: "save-food-cba1b.appspot.com"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('savingFood', ['ionic', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

//============ Configuration ===============/

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('tabs', {
    url: "/tab",
    abstract: true,
     templateUrl: "tabs/tabs.tpl.html"
 })
  .state('tabs.expiring', {
    url: '/expiring',
    views: {
      'tab-expiring': {
        templateUrl: 'expiring/expiring.tpl.html'
      }
    }
  })
  .state('tabs.containers', {
    url: '/containers',
    views: {
      'tab-containers': {
        templateUrl: 'containers/containers.tpl.html',
        controller: 'savingFood.containerCtrl'
      }
    }
  })
  .state('tabs.stats', {
    url: '/stats',
    views: {
      'tab-stats': {
        templateUrl: 'stats/stats.tpl.html'
      }
    }
  })
  .state('tabs.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'settings/settings.tpl.html'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise("/tab/expiring");
});

app.controller('savingFood.homeCtrl', homeCtrl);
homeCtrl.$inject = ['$scope', '$firebaseArray', '$firebaseObject', '$state', '$ionicModal'];
function homeCtrl($scope, $firebaseArray, $firebaseObject, $state, $ionicModal){

  // API
  $scope.openAddItemModal = openAddItemModal;
  $scope.closeAddItemModal = closeAddItemModal;

  //create a temporary user
  $scope.user = {
      id: 'bfiliczkowski',
      firstName: 'Bob',
      lastName: 'Filiczkowski',
      email: 'bfiliczkowski@gmail.com',
      password: 'heybob' // need to obfuscate this.
    };
  $scope.addItemModalProps = {
    buttonName: 'Add',
    executeFn: null,
    item: null
  };

  $ionicModal.fromTemplateUrl('addItem/addItem.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.itemModal = modal;
  });

  function openAddItemModal(id, item) {
    $scope.itemModal.show();
  }

  function closeAddItemModal() {
    $scope.itemModal.hide();
  }

}

app.controller('savingFood.containerCtrl', containerCtrl);
containerCtrl.$inject = ['$scope', '$firebaseObject', '$state', '$ionicModal'];
function containerCtrl($scope, $firebaseObject, $state, $ionicModal) {

  //Public Methods
  $scope.addContainer = addContainer;
  $scope.removeContainer = removeContainer;
  $scope.openAddContainerModal =  openAddContainerModal;
  $scope.closeAddContainerModal = closeAddContainerModal;

  //variables
  var containersRef = firebase.database().ref('containers');
  $scope.containers = $firebaseObject(containersRef);
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

  function removeContainer(id, container) {
    var ref = firebase.database().ref('containers/' + id);
    var obj = $firebaseObject(ref);
    obj.$remove();
  }
  function addContainer() {
    var container = {
      name: $scope.form.name,
      type: $scope.form.type.value
    };
    firebase.database().ref('containers').push(container);
    $scope.closeAddContainerModal();
  }

  function updateContainer(container){
    container.name = $scope.form.name;
    container.type = $scope.form.type.value;
    $scope.containers.$save();
    $scope.closeAddContainerModal();

  }

  function clearForm(){
    $scope.form.name = undefined;
    $scope.form.type = $scope.containerOptions[0];
  }

  $ionicModal.fromTemplateUrl('containers/addContainerModal.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.containerModal = modal;
  });
  function openAddContainerModal(id, container) {
    if(!id) { // implied Add
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
