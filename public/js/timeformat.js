timeSince : function timeSince(date) {
const parseDate = parseInt(date);
console.log(parseDate);
    var seconds = Math.floor((new Date() - parseDate) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return " před" + Math.floor(seconds) + " sec";
  }
  var aDay = 24*60*60*1000;