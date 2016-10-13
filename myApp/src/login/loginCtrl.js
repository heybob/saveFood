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
