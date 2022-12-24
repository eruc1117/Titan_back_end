const pool = require("../config/mySql/connect");
const CheckIn = require("./checkIn");
const bcrypt = require("bcrypt");

class User extends CheckIn {
  constructor(userId) {
    super(1);
    this.id = userId;
  }

  async getEmail() {
    const promisePool = pool.promise();
    const sqlCmd = `SELECT email FROM user WHERE id = ${this.id}`;
    const result = await promisePool.query(sqlCmd);
    return result[0][0]["email"];
  }

  async userGpsPunch(location) {
    return this.gpsPunch(this.id, location);
  }

  async userQrCodePunch() {
    return this.qrCodePunch(this.id);
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
