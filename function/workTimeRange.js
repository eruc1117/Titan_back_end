function workTimeRange() {
  const date = new Date();
  const [month, day, year, hour] = [
    date.getMonth() + 1,
    date.getDate(),
    date.getFullYear(),
    date.getHours(),
  ];

  function leapYear(year) {
    if (0 !== year % 4) {
      return false;
    } else if (0 === year % 4 && 0 !== year % 100) {
      return true;
    } else if (0 === year % 100 && 0 !== year % 400) {
      return false;
    } else if (0 === year % 400) {
      return true;
    }
  }
  let nextDay = hour > 0 && hour < 5 ? day - 1 : day + 1;
  let nextMonth = month;
  let nextYear = year;

  const monthRule = {
    1: 31,
    3: 31,
    5: 31,
    7: 31,
    8: 31,
    10: 31,
    12: 31,
    2: leapYear(year) ? 29 : 28,
    4: 30,
    6: 30,
    9: 30,
    11: 30,
  };

  let monthStr = nextMonth.toString();

  if (nextDay > monthRule[monthStr] && hour > 5) {
    nextDay = 1;
    nextMonth += 1;
  } else if (nextDay === 0 && hour < 5) {
    nextMonth -= 1;
    if (nextMonth === 0) {
      nextMonth = 12;
      nextYear -= 1;
      monthStr = nextMonth.toString();
    }
    nextDay = monthRule[monthStr];
  }

  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  let nowDateStart = "";
  let nowDateEnd = "";

  if (hour > 0 && hour < 5) {
    nowDateStart = `${nextYear}-${nextMonth}-${nextDay} 05:00:00`;
    nowDateEnd = `${year}-${month}-${day} 04:59:59`;
  } else {
    nowDateStart = `${year}-${month}-${day} 05:00:00`;
    nowDateEnd = `${nextYear}-${nextMonth}-${nextDay} 04:59:59`;
  }
  return {
    nowDateStart,
    nowDateEnd,
  };
}

module.exports = workTimeRange;
