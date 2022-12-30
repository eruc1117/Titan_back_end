const pool = require("../config/mySql/connect");
const CheckIn = require("./checkIn");
const bcrypt = require("bcrypt");

class User extends CheckIn {
  constructor(userId) {
    super();
    this.id = userId;
  }

  async getEmail() {
    const promisePool = pool.promise();
    const sqlCmd = `SELECT email FROM user WHERE id = ${this.id}`;
    const result = await promisePool.query(sqlCmd);
    return result[0][0]["email"];
  }

  async getDepId() {
    try {
      const promisePool = pool.promise();
      const sqlCmd = `SELECT depId FROM user WHERE id = ${this.id}`;
      const result = await promisePool.query(sqlCmd);
      return result[0][0]["depId"];
    } catch (err) {
      console.log(err);
    }
  }

  async getDepLocation() {
    try {
      const location = await this.getLocationInfo.call({
        id: await this.getDepId(),
      });
      return location;
    } catch (err) {}
  }

  async userGpsPunch(location) {
    try {
      return this.gpsPunch.call(
        { location: await this.getDepLocation() },
        this.id,
        location
      );
    } catch (err) {
      console.log(err);
    }
  }

  async userQrCodePunch(nowDateStart, nowDateEnd) {
    nowDateStart += " 05:00:00";
    nowDateEnd += " 04:59:59";
    return this.qrCodePunch(this.id, nowDateStart, nowDateEnd);
  }

  async updatePassword(verificationId, verification, userId, newPassword) {
    const promisePool = pool.promise();
    const sqlCmd = `SELECT id FROM verification WHERE id = ${verificationId} AND verification = ${verification}`;
    const preResult = await promisePool.query(sqlCmd);
    const result = preResult[0];
    if (result.length === 0) {
      return {
        status: false,
      };
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const password = await bcrypt.hash(newPassword, salt);
    let updateSql = `UPDATE user SET password = '${password}' WHERE id = ${userId}`;
    const updateResult = await promisePool.query(updateSql);
    let affectedRows = updateResult[0]["affectedRows"];

    return {
      status: affectedRows === 1 ? true : false,
    };
  }
}

module.exports = User;
