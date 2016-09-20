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
  }).state('tabs.conDetails', {
      url: '/conDetails',
      params: {
        container: null
      },
      views: {
        'tab-containers':  {
          templateUrl: 'containers/detailList.tpl.html',
          controller: 'savingFood.detailListCtrl'
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
  $scope.addItem = addItem;
  $scope.getReadableDate = getReadableDate;
  $scope.useItem = useItem;

  var ONE_DAY_MILLI = 86400000;
  var DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fr', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var containersRef = firebase.database().ref('containers');
  $scope.containers = $firebaseArray(containersRef);
  $scope.containers.$loaded().then(function(data){
    $scope.form.container = data[0];
    console.log(data);
  });

  var itemsRef = firebase.database().ref('items');
  //var itemsRef = firebase.database().ref('items').orderByChild("containerId").equalTo('-KRRn0YLqe1jTIfQ1XRf');
  $scope.items = $firebaseArray(itemsRef);


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

  $ionicModal.fromTemplateUrl('addItem/addItem.tpl.html', {
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

  function addItem(){
    var containerId = $scope.form.container.$id;
    var item = {
      name: $scope.form.name,
      servings: $scope.form.servings,
      expiresIn: $scope.form.expires,
      containerId: containerId,
      addedDate: firebase.database.ServerValue.TIMESTAMP,
      expDate: new Date(Date.now() + $scope.form.expires * ONE_DAY_MILLI).getTime()
    };
    firebase.database().ref('items').push(item);
    closeAddItemModal();
  }

  function getContainerId() {
    var containerKey;
    for(var container in $scope.containers){
      if(container.name == $scope.form.container){
        containerKey = container.$id;
      }
    }
  }

  function resetAddItemForm(){
    $scope.form = {};
  }

  function useItem(collection, item){
    if(item.servings > 1){
      item.servings -= 1;
      collection.$save(item);
    } else {
      collection.$remove(item);
    }
  }

  function getReadableDate(date){


    if(isToday(date)){
      return 'Today';
    } else if(isTomorrow(date)) {
      return 'Tomorrow';
    } else if(withinAWeek(date)) {
      var dayOfWeek = new Date(date).getDay();
      return DAYS_OF_WEEK[dayOfWeek];
    } else if(isExpired(date)){
      return 'Expired';
    } else {
      var date = new Date(date);
      var month = MONTHS[date.getMonth()];
      var day = date.getDate();
      return month + ' ' + day;
    }
  }

  function isExpired(date){
    return date < getToday().getTime();
  }

  function isToday(date) {
    var today = getToday().getTime();
    var tomorrow = getTomorrow().getTime();

    return today < date && date < tomorrow;
  }

  function isTomorrow(date){
    var tomorrow = getTomorrow().getTime();
    var nextDay = new Date(tomorrow + ONE_DAY_MILLI);
    return tomorrow < date && date < nextDay;
  }

  function withinAWeek(date){
    var twoDaysFromToday = getToday().getTime() + 2 * ONE_DAY_MILLI ;
    var weekFromToday = twoDaysFromToday + 3 * ONE_DAY_MILLI;
    return twoDaysFromToday < date && date < weekFromToday;
  }

  function getToday(){
    var todayStart = new Date(Date.now());
    todayStart.setHours(0);
    todayStart.setMinutes(0);
    todayStart.setSeconds(0);
    return todayStart;
  }

  function getTomorrow() {
    var today = getToday();
    return new Date(today.getTime() + ONE_DAY_MILLI);
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
  $scope.toggleEditMode = toggleEditMode;

  //variables

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
    $scope.containers.$remove(container);
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
    $scope.containers.$save(container);
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
app.controller('savingFood.detailListCtrl', detailListCtrl);
detailListCtrl.$inject = ['$scope', '$state', '$firebaseArray'];
function detailListCtrl($scope, $state, $firebaseArray){

  $scope.container = $state.params.container;
  if($scope.container){
    var detItemsRef = firebase.database().ref('items').orderByChild("containerId").equalTo($scope.container.$id);
    $scope.itemsDetail = $firebaseArray(detItemsRef);
  }
}
