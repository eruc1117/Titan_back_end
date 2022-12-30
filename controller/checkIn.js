const moment = require("moment-timezone");
const User = require("../class/user");
const CheckIn = require("../class/checkIn");
const bcrypt = require("bcrypt");
const haversine = require("haversine-distance");
const pool = require("../config/mySql/connect");

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
  preQrcode: async (req, res) => {
    try {
      const userId = req.params.userId;
      const location = req.body.location;

      const distance = haversine(await this.location, location);
      if (400 < distance) {
        return {
          state: false,
          message: "超過距離，無法打卡",
        };
      }
      const date = new Date();
      const [month, day, year] = [
        date.getMonth() + 1,
        date.getDate(),
        date.getFullYear(),
      ];

      const nowTime = `${year}-${month}-${day}`;

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
      let nowDateStart = `${year}-${month}-${day}`;

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
      let nowDateEnd = `${nextYear}-${nextMonth}-${nextDay}`;
      const saltRounds = 10;
      const salt = await bcrypt.genSaltSync(saltRounds);
      const verCode = await bcrypt.hashSync(
        `${userId},${nowDateStart},${nowDateEnd}`,
        salt
      );
      res.json({
        status: "200",
        message: {
          urlVerCode: verCode,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
  qrCodeCheckIn: async (req, res) => {
    try {
      const urlVerCode = req.params.urlVerCode;
      const userId = Number(req.params.userId);
      const date = new Date();
      const [month, day, year] = [
        date.getMonth() + 1,
        date.getDate(),
        date.getFullYear(),
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
      let nowDateStart = `${year}-${month}-${day}`;

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
      let nowDateEnd = `${nextYear}-${nextMonth}-${nextDay}`;

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
