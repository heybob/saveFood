angular.module('savingFood').factory('dataService', dataService);
dataService.$inject = ['$q','$rootScope', '$firebaseArray', 'dateFormatterService', 'Auth', 'logService'];

function dataService($q, $rootScope, $firebaseArray, dateFormatterService, Auth, logService){

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

  function useItem(item){
    if(item.servings > 1){
      logService.add(logService.createLogEntryFromItem(item));
      item.servings -= 1;
      userItems.$save(item);
    } else {
      logService.add(logService.createLogEntryFromItem(item));
      userItems.$remove(item);
    }
  }

  function addContainer(container){
    containers.$add(container);
  }

  function updateContainer(container){
    containers.$save(container);
  }

  function removeContainer(container){
    //TODO: May need to remove all items as well or transfer them.
    containers.$remove(container);
  }

  function trashItems(item){
    logService.add(logService.createLogEntryFromItem(item, true));
    userItems.$remove(item);
  }


  function createIntialContainers(){

    var containers = [];
    var container1 = {
      name: 'My Fridge',
      type: 'Fridge',
      owner: Auth.$getAuth().uid
    };
    container2 = {
      name: 'My Freezer',
      type: 'Freezer',
      owner: Auth.$getAuth().uid
    };

    containers.push(container1);
    containers.push(container2);

    containers.forEach(function(container){
      addContainer(container);
    });
  }


  return {
    initItems: initItems,
    initContainers: initContainers,
    getAllItems: getAllItems,
    getNumExpiredItems: getNumExpiredItems,
    useItem: useItem,
    addContainer: addContainer,
    updateContainer: updateContainer,
    removeContainer: removeContainer,
    createInitialContainers: createIntialContainers,
    trashItems: trashItems
  };
}
