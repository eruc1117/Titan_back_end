const pool = require("../config/mySql/connect");
const haversine = require("haversine-distance");

class CheckIn {
  constructor(depId) {
    this.id = depId;
    this.location = this.getLocationInfo();
  }

  async getLocationInfo() {
    try {
      const promisePool = pool.promise();
      let sqlCmd = `SELECT latitude, longitude FROM Titan.location `;
      sqlCmd += `WHERE depId = ${this.id}`;
      const result = await promisePool.query(sqlCmd);
      if (0 === result[0].length) {
        throw new Error("Department Id 錯誤!");
      }
      return result[0][0];
    } catch (err) {
      console.log(err);
    }
  }

  async gpsPunch(userId, location) {
    try {
      const distance = haversine(await this.location, location);
      if (400 < distance) {
        return {
          state: false,
          message: "超過距離，無法打卡",
        };
      }

      const date = new Date();
      const [month, day, year, hour, minutes, seconds] = [
        date.getMonth() + 1,
        date.getDate(),
        date.getFullYear(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
      ];

      const nowTime = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;

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
      let nowDateStart = `${year}-${month}-${day} 05:00:00`;

      let nextDay = day + 1;
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

      if (nextDay > monthRule[monthStr]) {
        nextDay = 1;
        nextMonth += 1;
      }

      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }
      let nowDateEnd = `${nextYear}-${nextMonth}-${nextDay} 04:59:59`;
      const promisePool = pool.promise();
      let sqlCmd = `call insertCheckTime(?, ? ,?)`;
      const result = await promisePool.query(sqlCmd, [
        userId,
        nowDateStart,
        nowDateEnd,
      ]);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async qrCodePunch(userId, nowDateStart, nowDateEnd) {
    try {
      const promisePool = pool.promise();
      let sqlCmd = `call insertCheckTime(?, ? ,?)`;
      const result = await promisePool.query(sqlCmd, [
        userId,
        nowDateStart,
        nowDateEnd,
      ]);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = CheckIn;
