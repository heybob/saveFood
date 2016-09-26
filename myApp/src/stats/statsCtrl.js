angular.module('savingFood').controller('savingFood.statsCtrl', statsCtrl);

statsCtrl.$inject = ['$scope', 'dataService', '$timeout'];

function statsCtrl($scope, dataService, $timeout) {
  var vm = this;
  var c10 = d3.scale.category10();
  vm.items = null;

  $scope.$watch('vm.items', function(newval, oldval){
    console.log(newval);
  });

  $scope.$on("$ionicView.beforeEnter", function() {
    if(vm.items){
      setExpiringStats();
      setPieData();
    }
  });

  $scope.$on('itemAdded', function(){
    $scope.$evalAsync(function (){
      setExpiringStats();
      setPieData();
    });
  });


  function setExpiringStats(){
    vm.expiringCnt = dataService.getNumExpiredItems();
    vm.totalCnt = dataService.items.length - vm.expiringCnt;
  }

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
    vm.items = dataService.getAllItems();
    vm.items.$loaded(function (){
      setExpiringStats();
      setPieData();
    });
  }

  function setPieData(){
    $scope.data = [
      {
        key: 'Expired',
        y: vm.expiringCnt
      },
      {
        key: 'Good',
        y: vm.totalCnt
      }
    ]
  }

  init();
}