angular.module('savingFood').controller('savingFood.settingsCtrl', settingsCtrl);

settingsCtrl.$inject = ['$scope', '$state', '$location', '$rootScope', 'Auth', 'dataService', 'logService'];

function settingsCtrl($scope, $state, $location, $rootScope, Auth, dataService, logService){

  $scope.signOut = function() {
    Auth.$signOut();
    dataService.destroyReferences();
    logService.destroyReferences();
    $state.go('login');
  }
};
