angular.module('savingFood').controller('savingFood.loginCtrl', loginCtrl);

loginCtrl.$inject = ['$rootScope', '$scope', '$state', '$location'];

function loginCtrl($rootScope, $scope, $state) {

  firebase.auth().onAuthStateChanged(function(user) {
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
    $scope.error = null;
    firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).catch(function(error) {
      $scope.$evalAsync(function(){
        $scope.error = error;
      });
    });
  };
}
