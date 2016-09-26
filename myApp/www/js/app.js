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
var app = angular.module('savingFood', ['ionic', 'firebase', 'nvd3'])

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
      templateUrl: "templates/tabs/tabs.tpl.html"
    })
    .state('tabs.expiring', {
      url: '/expiring',
      views: {
        'tab-expiring': {
          templateUrl: 'templates/expiring/expiring.tpl.html'
        }
      }
    })
    .state('tabs.containers', {
      url: '/containers',
      views: {
        'tab-containers': {
          templateUrl: 'templates/containers/containers.tpl.html',
          controller: 'savingFood.containerCtrl'
        }
      }
    })
    .state('tabs.stats', {
      url: '/stats',
      views: {
        'tab-stats': {
          templateUrl: 'templates/stats/stats.tpl.html',
          controller: 'savingFood.statsCtrl'
        }
      }
    })
    .state('tabs.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          templateUrl: 'templates/settings/settings.tpl.html'
        }
      }
    }).state('tabs.conDetails', {
      url: '/conDetails',
      params: {
        container: null
      },
      views: {
        'tab-containers':  {
          templateUrl: 'templates/containers/detailList.tpl.html',
          controller: 'savingFood.detailListCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/tab/expiring");
});

angular.module('savingFood').controller('savingFood.containerCtrl', containerCtrl);
containerCtrl.$inject = ['$scope','$ionicModal', '$ionicActionSheet'];
function containerCtrl($scope, $ionicModal, $ionicActionSheet) {

  //Public Methods
  $scope.addContainer = addContainer;
  $scope.removeContainer = removeContainer;
  $scope.openAddContainerModal =  openAddContainerModal;
  $scope.closeAddContainerModal = closeAddContainerModal;
  $scope.toggleEditMode = toggleEditMode;

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

angular.module('savingFood').controller('savingFood.statsCtrl', statsCtrl);

statsCtrl.$inject = ['$scope', 'dataService', '$timeout'];

function statsCtrl($scope, dataService, $timeout) {
  var vm = this;
  var c10 = d3.scale.category10();
  vm.items = null;

  $scope.$watch('vm.items', function(newval, oldval){
    console.log(newval);
  });

  $scope.$on("$ionicView.beforeEnter", function() {
    if(vm.items){
      setExpiringStats();
      setPieData();
    }
  });

  $scope.$on('itemAdded', function(){
    $scope.$evalAsync(function (){
      setExpiringStats();
      setPieData();
    });
  });


  function setExpiringStats(){
    vm.expiringCnt = dataService.getNumExpiredItems();
    vm.totalCnt = dataService.items.length - vm.expiringCnt;
  }

  $scope.options = {
    chart: {
      type: 'pieChart',
      height: 300,
      width: 300,
      color: function(d,i){return c10(i)},
      x: function(d){return d.key;},
      y: function(d){return d.y;},
      showLabels: true,
      showLegend: false,
      duration: 500,
      labelThreshold: 0.01,
      labelSunbeamLayout: false,
/*      legend: {
        margin: {
          top: 5,
          right: 35,
          bottom: 5,
          left: 0
        }
      }
*/
    }
  };

  $scope.data = [
    {
      key: "Expired",
      y: 1
    },
    {
      key: "Good",
      y: 1
    }
  ];

  function init(){
    vm.items = dataService.getAllItems();
    vm.items.$loaded(function (){
      setExpiringStats();
      setPieData();
    });
  }

  function setPieData(){
    $scope.data = [
      {
        key: 'Expired',
        y: vm.expiringCnt
      },
      {
        key: 'Good',
        y: vm.totalCnt
      }
    ]
  }

  init();
}

angular.module('savingFood').factory('dataService', dataService);
dataService.$inject = ['$firebaseArray', 'dateFormatterService'];

function dataService($firebaseArray, dateFormatterService){
  var itemsRef = firebase.database().ref('items');
  var items = $firebaseArray(itemsRef);
  var today = dateFormatterService.getToday().getTime();
  var numExpiredItems;
  var i;

  function getAllItems(){
    return items;
  }

  function getNumExpiredItems(){
    numExpiredItems = 0;
    for(i = 0; i < items.length; i++) {
      if(items[i].expDate < today){
        numExpiredItems++;
      }
    }
    return numExpiredItems;
  }

  function isExpired(item){
    return item.expDate < today;
  }

  return {
    items: items,
    getAllItems: getAllItems,
    getNumExpiredItems: getNumExpiredItems,
    isExpired: isExpired
  };
}

angular.module('savingFood').factory('dateFormatterService', dateFormatterService);

function dateFormatterService(){

  var ONE_DAY_MILLI = 86400000;
  var DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

  // Return service API
  return {
    ONE_DAY_MILLI: ONE_DAY_MILLI,
    getReadableDate: getReadableDate,
    getToday: getToday
  };
}
