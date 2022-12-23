const moment = require("moment-timezone");
const User = require("../class/user");

const checkInController = {
  checkIn: async (req, res) => {
    const id = req.body.userId;
    const location = req.body.location;
    const empoloyee = new User(id);
    const preCheckLog = await empoloyee.userGpsPunch(location);
    const checkLog = preCheckLog[0][0][0];
    let returnInfo = {
      userId: checkLog["userId"],
    };
    returnInfo["startTime"] = moment(checkLog["start"])
      .utc("Asia/Tokyo")
      .format("YYYY-MM-DD HH:mm:ss");
    returnInfo["endTime"] = moment(checkLog["end"])
      .utc("Asia/Tokyo")
      .format("YYYY-MM-DD HH:mm:ss");
    res.status(200).json(returnInfo);
  },
};

module.exports = checkInController;
