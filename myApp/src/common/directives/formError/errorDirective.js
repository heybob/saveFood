angular.module('savingFood').directive('formError', ['$timeout', function($timeout){


  function link(scope, element, attrs) {

    function updateError(error){
      scope.error = error;
    }

    scope.$watch(attrs.error, function(newval, oldval) {
      updateError(newval);
    });
  }

  return {
    restrict: 'E',
    transclude: true,
    scope: {error: '=error'},
    templateUrl: 'templates/common/directives/formError/formError.tpl.html',
    link: link
  };

}]);
