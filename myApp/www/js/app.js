// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDkT1Ozv1WFOVPG18AJylS7rsIxj46fjZc",
    authDomain: "save-food-cba1b.firebaseapp.com",
    databaseURL: "https://save-food-cba1b.firebaseio.com",
    storageBucket: "save-food-cba1b.appspot.com",
  };
  firebase.initializeApp(config);
  var database = firebase.database();

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'firebase'])

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
        templateUrl: 'containers/containers.tpl.html'
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
  })
  .state('addItem', {
    url: 'addItem',
    views: {
      'addItem': {
        templateUrl: 'addItem/addItem.tpl.html'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise("/tab/expiring");
});

app.controller('starter.testCtrl', test);
  test.$inject = ['$scope', '$firebaseArray', '$firebaseObject', '$state']
function test($scope, $firebaseArray, $firebaseObject, $state){
  $scope.testForm = {};
  var namesRef = firebase.database().ref('testNames');
  $scope.names = $firebaseObject(namesRef);
  $scope.addName = addName;
  $scope.sayHello = function(){
    console.log('say hello');
  };

  setTimeout(function(){
    console.log($scope.names);
  },3000);
  function addName() {
    if($scope.testForm.name){
      firebase.database().ref('testNames').push({
      name: $scope.testForm.name
    });
      clearForm();
    }
  }

  $scope.removeName = function(name){
    name.name = null;
    $scope.names.$save();
    clearForm();
 
  };

  function clearForm(){
    $scope.testForm = {};
  }
}