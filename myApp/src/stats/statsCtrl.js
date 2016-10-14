angular.module('savingFood').controller('savingFood.statsCtrl', statsCtrl);

statsCtrl.$inject = ['$scope', 'dataService', '$timeout', 'logService', '$state', '$rootScope'];

function statsCtrl($scope, dataService, $timeout, logService, $state, $rootScope) {
  var vm = this;
  var c10 = d3.scale.category10();
  vm.items = null;

  $scope.$on("$ionicView.beforeEnter", function () {
    setPieData();
  });

  $scope.options = {
    chart: {
      type: 'pieChart',
      height: 300,
      width: 300,
      color: function (d, i) {
        return c10(i)
      },
      x: function (d) {
        return d.key;
      },
      y: function (d) {
        return d.y;
      },
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

  function init() {

  }

  function setPieData() {

    logService.getAllTimeStats().then(function (results) {
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
    });
  }

  init();
}
