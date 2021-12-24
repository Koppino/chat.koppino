const Post = require('../models/Post')
const Like = require('../models/Like')


module.exports.formatDate = (date) => {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " r. zpět";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " měs.";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " d"
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return  Math.floor(interval) + " hod";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " min";
    }
    return "teď"
  
}
