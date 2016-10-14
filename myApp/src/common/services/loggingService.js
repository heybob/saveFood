angular.module('savingFood').factory('logService', logService);

logService.$inject = ['$rootScope', '$firebaseArray', 'Auth', 'dateFormatterService', '$state', '$q'];

function logService($rootScope, $firebaseArray, Auth, dateFormatterService, $state, $q){

  var usageLog, log, userId ;

  // Gets the users logging data.
  function initLogging() {
    var deferred = $q.defer();
    userId = Auth.$getAuth().uid;
    if(!usageLog || !log){
      usageLog = firebase.database().ref('log').orderByChild("creator").equalTo(userId);
      log = $firebaseArray(usageLog);
      log.$loaded(function(){
        deferred.resolve();
      }).catch(function(){
        console.log('Error: Unable to get log Data');
        deferred.reject();
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }


  var service = {
    add: addLogEntry,
    createLogEntryFromItem: createLogEntryFromItem,
    getAllTimeStats: getAllTimeStats,
    destroyReferences: destroyReferences
  };

  function addLogEntry(params){
    //Make sure Log exists!
    initLogging().then(function(){
      log.$add(params);
    });
  }

  /** Creates a log entry for every item used or trashed if expired
   *
   * @param item:  an items inside a container
   * @param allServings: flag to remove all servings. If true use item servings or just log 1.
   * @returns {{name: *, addedDate: *, expDate: *, containerId: containerId, servingsUsed: *, creator: *, isExpired: *}}
   */
  function createLogEntryFromItem(item, allServings){
    var servings = parseInt(allServings ? item.servings : 1);
    var logEntry = {
      name: item.name,
      addedDate: item.addedDate,
      expDate: item.expDate,
      containerId: item.containerId,
      servingsUsed: servings,
      creator: userId,
      isExpired: dateFormatterService.isExpired(item.expDate)
    };
    return logEntry;
  }


  function getAllTimeStats(){
    var deferred = $q.defer();

    initLogging().then(function(){
      var expiredCnt = 0,
          validCnt = 0,
          i= 0;
      for(i; i < log.length; i++){
       if(log[i].isExpired) {
         expiredCnt += parseInt(log[i].servingsUsed);
       } else {
         validCnt += 1;
       }
      }
      deferred.resolve({expired: expiredCnt, used: validCnt});
    });

    return deferred.promise;
  }

  function destroyReferences(){
    usageLog = null;
    log = null;
  }

  return service;
}
