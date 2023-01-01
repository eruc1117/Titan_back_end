const moment = require("moment-timezone");
const User = require("../class/user");
const bcrypt = require("bcrypt");
const haversine = require("haversine-distance");
const workTimeRange = require("../function/workTimeRange");

const checkInController = {
  checkIn: async (req, res) => {
    const userId = req.middlewarePassData.userId;
    const location = req.body.location;
    const empoloyee = new User(userId);
    const info = await empoloyee.userGpsPunch(location);
    res.status(200).json(info);
  },
  preQrcode: async (req, res) => {
    try {
      const userId = req.middlewarePassData.userId;
      const location = req.body.location;
      const employee = new User(userId);
      const distance = haversine(await employee.getDepLocation(), location);
      if (400 < distance) {
        res.json({
          status: 400,
          message: "超過距離，無法打卡",
        });
      }

      const { nowDateStart, nowDateEnd } = workTimeRange();

      const saltRounds = 10;
      let verCode = "";
      do {
        let salt = await bcrypt.genSaltSync(saltRounds);
        verCode = await bcrypt.hashSync(
          `${userId},${nowDateStart},${nowDateEnd}`,
          salt
        );
      } while (verCode.indexOf("/") !== -1 ?? verCode.indexOf("?") !== -1);
      res.json({
        status: 200,
        message: verCode,
      });
    } catch (err) {
      console.log(err);
    }
  },
  qrCodeCheckIn: async (req, res) => {
    try {
      const urlVerCode = req.params.urlVerCode;
      const userId = Number(req.params.userId);

      const { nowDateStart, nowDateEnd } = workTimeRange();

      const compareResult = await bcrypt.compareSync(
        `${userId},${nowDateStart},${nowDateEnd}`,
        urlVerCode
      );
      if (!compareResult) {
        res.json({
          status: "460",
          message: "Qr Code 已過期 !!",
        });
        return 0;
      }
      const employee = new User(userId);
      const preCheckLog = await employee.userGpsPunch(nowDateStart, nowDateEnd);
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
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = checkInController;
