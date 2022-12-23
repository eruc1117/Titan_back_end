const pool = require("../config/mySql/connect");
const CheckIn = require("./checkIn");

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
}

module.exports = User;
