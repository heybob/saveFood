angular.module('savingFood').controller('savingFood.settingsCtrl', settingsCtrl);

settingsCtrl.$inject = ['$scope', '$state', '$location', '$rootScope', 'Auth'];

function settingsCtrl($scope, $state, $location, $rootScope, Auth){

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
