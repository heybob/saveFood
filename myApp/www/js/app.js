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

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

app.run(["$rootScope", "$state", function ($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("login");
    }
  });
}]);

//============ Configuration ===============/

app.config(function ($stateProvider, $urlRouterProvider) {
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
          templateUrl: 'templates/expiring/expiring.tpl.html',
          controller: 'savingFood.expiringCtrl'
        }
      },
      resolve: {
        "currentAuth": ["Auth","$state", function (Auth, $state) {
          // $waitForSignIn returns a promise so the resolve waits for it to complete
          return Auth.$waitForSignIn().then(function(data){
            if(!data){
              $state.go('login');
            }
          });
        }]
      }
    })
    .state('tabs.containers', {
      url: '/containers',
      views: {
        'tab-containers': {
          templateUrl: 'templates/containers/containers.tpl.html',
          controller: 'savingFood.containerCtrl'
        }
      },
      resolve: {
        "currentAuth": ["Auth","$state", function (Auth, $state) {
          // $waitForSignIn returns a promise so the resolve waits for it to complete
          return Auth.$waitForSignIn().then(function(data){
            if(!data){
              $state.go('login');
            }
          });
        }]
      }
    })
    .state('tabs.stats', {
      url: '/stats',
      views: {
        'tab-stats': {
          templateUrl: 'templates/stats/stats.tpl.html',
          controller: 'savingFood.statsCtrl'
        }
      },
      resolve: {
        "currentAuth": ["Auth","$state", function (Auth, $state) {
          // $waitForSignIn returns a promise so the resolve waits for it to complete
          return Auth.$waitForSignIn().then(function(data){
            if(!data){
              $state.go('login');
            }
          });
        }]
      }
    })
    .state('tabs.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          templateUrl: 'templates/settings/settings.tpl.html',
          controller: 'savingFood.settingsCtrl'
        }
      },
      resolve: {
        "currentAuth": ["Auth","$state", function (Auth, $state) {
          // $waitForSignIn returns a promise so the resolve waits for it to complete
          return Auth.$waitForSignIn().then(function(data){
            if(!data){
              $state.go('login');
            }
          });
        }]
      }
    }).state('tabs.conDetails', {
      url: '/conDetails',
      params: {
        container: null
      },
      views: {
        'tab-containers': {
          templateUrl: 'templates/containers/detailList.tpl.html',
          controller: 'savingFood.detailListCtrl'
        }
      },
      resolve: {
        "currentAuth": ["Auth","$state", function (Auth, $state) {
          // $waitForSignIn returns a promise so the resolve waits for it to complete
          return Auth.$waitForSignIn().then(function(data){
            if(!data){
              $state.go('login');
            }
          });
        }]
      }
    }).state('register', {
      url: '/register',
      templateUrl: 'templates/registration/register.tpl.html',
      controller: 'savingFood.registerCtrl'
    }).state('login', {
      url: '/login',
      templateUrl: 'templates/login/login.tpl.html',
      controller: 'savingFood.loginCtrl'
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/login");
});

app.factory("Auth", ["$firebaseAuth",
  function ($firebaseAuth) {
    return $firebaseAuth();
  }
]);

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
    dataService.initContainers().then(function(data){
      $scope.containers = data;
    });
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

angular.module('savingFood').controller('savingFood.detailListCtrl', detailListCtrl);
detailListCtrl.$inject = ['$scope', '$state', '$firebaseArray', 'dataService', 'logService', 'dateFormatterService'];
function detailListCtrl($scope, $state, $firebaseArray, dataService, logService, dateFormatterService){

  var vm = this;

  // Public
  $scope.isExpired = dateFormatterService.isExpired;
  $scope.useItem = dataService.useItem;

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

angular.module('savingFood').controller('savingFood.expiringCtrl', expiringCtrl);

expiringCtrl.$inject = ['$scope', 'logService', 'dateFormatterService', '$rootScope', '$state','dataService'];

function expiringCtrl($scope, logService, dateFormatterService, $rootScope, $state, dataService){

  //Api
  $scope.getReadableDate = getReadableDate;
  $scope.useItem = useItem;
  $scope.notExpired = notExpired;



  $scope.$on("$ionicView.beforeEnter", function() {
    dataService.initItems().then(function(data){
      $scope.items = data;
    });

    dataService.initContainers().then(function(data){
      $scope.containers = data;
    });
  });

  function useItem(collection, item){
    if(item.servings > 1){
      logService.add(logService.createLogEntryFromItem(item));
      item.servings -= 1;
      collection.$save(item);
    } else {
      logService.add(logService.createLogEntryFromItem(item));
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

angular.module('savingFood').controller('savingFood.loginCtrl', loginCtrl);

loginCtrl.$inject = ['$rootScope', '$scope', '$state', '$location'];

function loginCtrl($rootScope, $scope, $state) {


  firebase.auth().onAuthStateChanged(function(user) {
    $rootScope.user = user;
      if (user) {
        $state.go('tabs.expiring');
      }
  });
  $scope.$on("$ionicView.beforeEnter", function() {
      init();
  });

  function init(){
    $scope.user = {};
  }

  $scope.login = function() {
    firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log(errorCode);
      console.log(errorMessage);
    });
  };
}

angular.module('savingFood').controller('savingFood.registerCtrl', registerCtrl);

registerCtrl.$inject = ['$scope', 'Auth', '$state'];

function registerCtrl($scope, Auth, $state) {
  //Api
  $scope.register = createUser;

  // variables
  $scope.regForm = {};

  function createUser() {
    $scope.error = undefined;
    Auth.$createUserWithEmailAndPassword($scope.regForm.email, $scope.regForm.password).then(function (userData) {
      console.log("User " + userData.uid + " created successfully!");

      return Auth.$signInWithEmailAndPassword($scope.regForm.email, $scope.regForm.password).then(function (authData) {
        // Do first time setup
        $state.go('expiring');
      });
    }).catch(function (error) {
      $scope.error = error;
    });
  }
}

angular.module('savingFood').controller('savingFood.settingsCtrl', settingsCtrl);

settingsCtrl.$inject = ['$scope', '$state', '$location', '$rootScope'];

function settingsCtrl($scope, $state, $location, $rootScope){

  $scope.$on("$ionicView.beforeEnter", function() {
    if(!$rootScope.user){
      $state.go('login');
    }
  });

  $scope.signOut = function(){
    //Need to destroy references.
    firebase.auth().signOut().then(function() {
      var port = $location.port() === 80 ? '' : ':' + $location.port();
      var url = $location.protocol() + '://' + $location.host() + port + '/';
      window.location.href = url;
      $rootScope.$broadcast('userLogged');
    }, function(error) {
      // An error happened.
    });
  };

}

angular.module('savingFood').controller('savingFood.statsCtrl', statsCtrl);

statsCtrl.$inject = ['$scope', 'dataService', '$timeout', 'logService','$state','$rootScope'];

function statsCtrl($scope, dataService, $timeout, logService, $state, $rootScope) {
  var vm = this;
  var c10 = d3.scale.category10();
  vm.items = null;

  $scope.$on("$ionicView.beforeEnter", function() {
    setPieData();
  });

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

  }

  function setPieData(){
    var results = logService.getAllTimeStats();
    $scope.data = [
      {
        key: "Wasted",
        y: results.expired
      },
      {
        key: "Used",
        y: results.used
      }
    ];
  }

  init();
}

angular.module('savingFood').factory('dataService', dataService);
dataService.$inject = ['$q','$rootScope', '$firebaseArray', 'dateFormatterService', 'Auth', 'logService'];

function dataService($q, $rootScope, $firebaseArray, dateFormatterService, Auth, logService){

  var items, itemsRef, containersRef, containers, defaultContainer;
  var userId;


  //Move To Container Controller
  //$scope.containers.$loaded().then(function(data){
  //  $scope.form.container = data[0];
  //  console.log(data);
  //});

  var today = dateFormatterService.getToday().getTime();
  var numExpiredItems;
  var i;
  var userItems, itemsRef;
  var containers, containersRef;

  function initItems(){
    userId = userId ? userId : Auth.$getAuth().uid;
    var deferred = $q.defer();
    if(userItems){
      deferred.resolve(userItems);
    } else {
      itemsRef = firebase.database().ref('items').orderByChild("owner").equalTo(userId);
      userItems = $firebaseArray(itemsRef);
      userItems.$loaded(function(data){
        deferred.resolve(userItems);
      });
    }
    return deferred.promise;
  }

  function initContainers(){
    userId = userId ? userId : Auth.$getAuth().uid;
    var deferred = $q.defer();
    if(containers){
      deferred.resolve(containers);
    } else {
      containersRef = firebase.database().ref('containers').orderByChild("owner").equalTo(userId);
      containers = $firebaseArray(containersRef);
      containers.$loaded(function(data){
        deferred.resolve(containers);
      });
    }
    return deferred.promise;
  }

  function init(){
    var deferred = $q.defer();

    return deferred.promise;
  }

  function getAllItems(){
    itemsRef = firebase.database().ref('items');
    return $firebaseArray(itemsRef);
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

  function useItem(collection, item){
    if(item.servings > 1){
      logService.add(logService.createLogEntryFromItem(item));
      item.servings -= 1;
      collection.$save(item);
    } else {
      logService.add(logService.createLogEntryFromItem(item));
      collection.$remove(item);
    }
  }

  return {
    initItems: initItems,
    initContainers: initContainers,
    getAllItems: getAllItems,
    getNumExpiredItems: getNumExpiredItems,
    useItem: useItem
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
    getToday: getToday,
    isExpired: isExpired
  };
}

angular.module('savingFood').factory('logService', logService);

logService.$inject = ['$rootScope', '$firebaseArray', 'Auth', 'dateFormatterService', '$state' ];

function logService($rootScope, $firebaseArray, Auth, dateFormatterService, $state){

  var usageLog, log, userId ;

  Auth.$waitForSignIn().then(function (data){
    if(!data){
      $state.go('login');
    }
    userId = userId ? userId : Auth.$getAuth().uid;
    usageLog = firebase.database().ref('log').orderByChild("creator").equalTo(userId);
    log = $firebaseArray(usageLog);
  });


  var service = {
    add: addLogEntry,
    createLogEntryFromItem: createLogEntryFromItem,
    getAllTimeStats: getAllTimeStats
  };

  function addLogEntry(params){
    //Make sure Log exists!
    log.$add(params);
  }

  function createLogEntryFromItem(item){
    var logEntry = {
      name: item.name,
      addedDate: item.addedDate,
      expDate: item.expDate,
      containerId: item.containerId,
      servingsUsed: 1,
      creator: userId,
      isExpired: dateFormatterService.isExpired(item)
    };
    return logEntry;
  }

  function getAllTimeStats(){
    var expiredCnt = 0,
      validCnt = 0,
      i= 0;
    for(i; i < log.length; i++){
     if(log[i].isExpired) {
       expiredCnt += log[i].servingsUsed;
     } else {
       validCnt += 1;
     }
    }
    return {expired: expiredCnt, used: validCnt};
  }

  function getNumUsedAllTime() {

  }

  return service;
}
