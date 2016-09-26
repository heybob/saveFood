angular.module('savingFood').factory('dataService', dataService);
dataService.$inject = ['$firebaseArray', 'dateFormatterService'];

function dataService($firebaseArray, dateFormatterService){
  var itemsRef = firebase.database().ref('items');
  var items = $firebaseArray(itemsRef);
  var today = dateFormatterService.getToday().getTime();
  var numExpiredItems;
  var i;

  function getAllItems(){
    return items;
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

  return {
    items: items,
    getAllItems: getAllItems,
    getNumExpiredItems: getNumExpiredItems
  };
}
