angular.module('savingFood').factory('dateFormatterService', dateFormatterService);

function dateFormatterService(){

  var ONE_DAY_MILLI = 86400000;
  var DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function getReadableDate(date){
    if(isToday(date)){
      return 'Today';
    } else if(isTomorrow(date)) {
      return 'Tomorrow';
    } else if(withinAWeek(date)) {
      var dayOfWeek = new Date(date).getDay();
      return DAYS_OF_WEEK[dayOfWeek];
    } else if(isExpired(date)){
      return 'Expired';
    } else {
      var date = new Date(date);
      var month = MONTHS[date.getMonth()];
      var day = date.getDate();
      return month + ' ' + day;
    }
  }

  function isExpired(date){
    return date < getToday().getTime();
  }

  function isToday(date) {
    var today = getToday().getTime();
    var tomorrow = getTomorrow().getTime();

    return today < date && date < tomorrow;
  }

  function isTomorrow(date){
    var tomorrow = getTomorrow().getTime();
    var nextDay = new Date(tomorrow + ONE_DAY_MILLI);
    return tomorrow < date && date < nextDay;
  }

  function withinAWeek(date){
    var twoDaysFromToday = getToday().getTime() + 2 * ONE_DAY_MILLI ;
    var weekFromToday = twoDaysFromToday + 3 * ONE_DAY_MILLI;
    return twoDaysFromToday < date && date < weekFromToday;
  }

  function getToday(){
    var todayStart = new Date(Date.now());
    todayStart.setHours(0);
    todayStart.setMinutes(0);
    todayStart.setSeconds(0);
    return todayStart;
  }

  function getTomorrow() {
    var today = getToday();
    return new Date(today.getTime() + ONE_DAY_MILLI);
  }

  // Return service API
  return {
    ONE_DAY_MILLI: ONE_DAY_MILLI,
    getReadableDate: getReadableDate,
    getToday: getToday
  };
}
