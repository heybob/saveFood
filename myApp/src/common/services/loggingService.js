angular.module('savingFood').factory('logService', logService);

logService.$inject = ['$rootScope', '$firebaseArray', 'Auth', 'dateFormatterService', '$state' ];

function logService($rootScope, $firebaseArray, Auth, dateFormatterService, $state){

  var usageLog, log, userId ;

  Auth.$waitForSignIn().then(function (data){
    if(!data){
      $state.go('login');
    }
    userId = userId ? userId : Auth.$getAuth().uid;
    usageLog = firebase.database().ref('log').orderByChild("creator").equalTo(userId);
    log = $firebaseArray(usageLog);
  });


  var service = {
    add: addLogEntry,
    createLogEntryFromItem: createLogEntryFromItem,
    getAllTimeStats: getAllTimeStats
  };

  function addLogEntry(params){
    //Make sure Log exists!
    log.$add(params);
  }

  function createLogEntryFromItem(item){
    var logEntry = {
      name: item.name,
      addedDate: item.addedDate,
      expDate: item.expDate,
      containerId: item.containerId,
      servingsUsed: 1,
      creator: userId,
      isExpired: dateFormatterService.isExpired(item)
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
