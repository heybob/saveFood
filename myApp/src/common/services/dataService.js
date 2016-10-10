angular.module('savingFood').factory('dataService', dataService);
dataService.$inject = ['$q','$rootScope', '$firebaseArray', 'dateFormatterService', 'Auth'];

function dataService($q, $rootScope, $firebaseArray, dateFormatterService, Auth){

  var items, itemsRef, containersRef, containers, defaultContainer;
  var userId;


  //Move To Container Controller
  //$scope.containers.$loaded().then(function(data){
  //  $scope.form.container = data[0];
  //  console.log(data);
  //});

  var today = dateFormatterService.getToday().getTime();
  var numExpiredItems;
  var i;
  var userItems, itemsRef;
  var containers, containersRef;

  function initItems(){
    userId = userId ? userId : Auth.$getAuth().uid;
    var deferred = $q.defer();
    if(userItems){
      deferred.resolve(userItems);
    } else {
      itemsRef = firebase.database().ref('items').orderByChild("owner").equalTo(userId);
      userItems = $firebaseArray(itemsRef);
      userItems.$loaded(function(data){
        deferred.resolve(userItems);
      });
    }
    return deferred.promise;
  }

  function initContainers(){
    userId = userId ? userId : Auth.$getAuth().uid;
    var deferred = $q.defer();
    if(containers){
      deferred.resolve(containers);
    } else {
      containersRef = firebase.database().ref('containers').orderByChild("owner").equalTo(userId);
      containers = $firebaseArray(containersRef);
      containers.$loaded(function(data){
        deferred.resolve(containers);
      });
    }
    return deferred.promise;
  }

  function init(){
    var deferred = $q.defer();

    return deferred.promise;
  }

  function getAllItems(){
    itemsRef = firebase.database().ref('items');
    return $firebaseArray(itemsRef);
  }

  function getNumExpiredItems(){
    numExpiredItems = 0;
    for(i = 0; i < items.length; i++) {
      if(items[i].expDate < today){
        numExpiredItems++;
      }
    }
    return numExpiredItems;
  }

  function isExpired(item){
    return item.expDate < today;
  }

  return {
    initItems: initItems,
    initContainers: initContainers,
    getAllItems: getAllItems,
    getNumExpiredItems: getNumExpiredItems,
    isExpired: isExpired
  };
}
