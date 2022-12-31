const pool = require("../config/mySql/connect");
const haversine = require("haversine-distance");
const workTimeRange = require("../function/workTimeRange");

class CheckIn {
  constructor(depId) {
    this.id = depId;
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
      const distance = haversine(await this.location, location); //暫時先以 call 或是 apply 附帶 location
      if (400 < distance) {
        return {
          state: false,
          message: "超過距離，無法打卡",
        };
      }

      const { nowDateStart, nowDateEnd } = workTimeRange();

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
