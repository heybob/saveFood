angular.module('savingFood').factory('logService', logService);

logService.$inject = ['$rootScope', '$firebaseArray', 'Auth', 'dataService' ];

function logService($rootScope, $firebaseArray, Auth, dataService){

  var usageLog, log ;
  var userId = Auth.$getAuth().uid;
  usageLog = firebase.database().ref('log').orderByChild("creator").equalTo(userId);
  log = $firebaseArray(usageLog);


  var service = {
    add: addLogEntry,
    createLogEntryFromItem: createLogEntryFromItem,
    getAllTimeStats: getAllTimeStats
  };

  function addLogEntry(params){
    log.$add(params);
  }

  function createLogEntryFromItem(item){
    var logEntry = {
      name: item.name,
      addedDate: item.addedDate,
      expDate: item.expDate,
      containerId: item.containerId,
      servingsUsed: 1,
      creator: $rootScope.user.uid,
      isExpired: dataService.isExpired(item)
    };
    return logEntry;
  }

  function getAllTimeStats(){
    var expiredCnt = 0,
      validCnt = 0,
      i= 0;
    for(i; i < log.length; i++){
     if(log[i].isExpired) {
       expiredCnt += log[i].servingsUsed;
     } else {
       validCnt += 1;
     }
    }
    return {expired: expiredCnt, used: validCnt};
  }

  function getNumUsedAllTime() {

  }

  return service;
}
