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
