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
var app = angular.module('savingFood', ['ionic', 'firebase', 'nvd3', 'ngAnimate'])

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
