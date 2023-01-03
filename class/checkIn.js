const pool = require("../config/mySql/connect");
const haversine = require("haversine-distance");
const workTimeRange = require("../function/workTimeRange");
const moment = require("moment-timezone");

class CheckIn {
  constructor(depId) {
    this.id = depId;
  }

  async getLocationInfo() {
    try {
      const promisePool = pool.promise();
      let sqlCmd = `SELECT latitude, longitude FROM location `;
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
          status: 400,
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
      const checkLog = result[0][0][0];
      let returnInfo = {
        status: 200,
        userId: checkLog["userId"],
      };
      returnInfo["startTime"] = moment(checkLog["start"])
        .utc("Asia/Tokyo")
        .format("YYYY-MM-DD HH:mm:ss");
      returnInfo["endTime"] = moment(checkLog["end"])
        .utc("Asia/Tokyo")
        .format("YYYY-MM-DD HH:mm:ss");
      return returnInfo;
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
