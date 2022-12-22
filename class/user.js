const CheckIn = require("./checkIn");

class User extends CheckIn {
  constructor(userId) {
    super(1);
    this.id = userId;
  }

  async userGpsPunch(location) {
    return this.gpsPunch(this.id, location);
  }

  async userQrCodePunch() {
    return this.qrCodePunch(this.id);
  }
}

module.exports = User;
