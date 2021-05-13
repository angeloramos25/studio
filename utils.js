export function getPrettyDateString(ms) {
  var today = ms ? new Date(ms) : new Date();
  var dayIndex = today.getDay();
  var monthIndex = today.getMonth();
  var date = today.getDate();

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

  var hours = today.getHours();
  var minutes = today.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;

  return weekdays[dayIndex] + ', ' + months[monthIndex] + ' ' + date + ', ' + strTime;
}

export function daysAgo(ms) {
  const daysAgo = Math.floor(((new Date()).getTime() - ms) / (1000 * 3600 * 24));
  return daysAgo > 0 ? daysAgo + 'd ago' : 'Today';
}
