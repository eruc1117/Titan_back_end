const pool = require("../config/mySql/connect");
const moment = require("moment-timezone");

const adminController = {
  getAbsentUser: async (req, res) => {
    try {
      const promisePool = pool.promise();
      const workTime = req.body.workTime;
      let preNextWorkTime = workTime.split("-");
      let nextDay = Number(preNextWorkTime[2]) + 1;
      let nextMonth = Number(preNextWorkTime[1]);
      let nextYear = Number(preNextWorkTime[0]);

      const monthRule = {
        1: 31,
        3: 31,
        5: 31,
        7: 31,
        8: 31,
        10: 31,
        12: 31,
        2: leapYear(nextYear) ? 29 : 28,
        4: 30,
        6: 30,
        9: 30,
        11: 30,
      };

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

      let monthStr = nextMonth.toString();

      if (nextDay > monthRule[monthStr]) {
        nextDay = 1;
        nextMonth += 1;
      }

      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }
      let absentSql = `SELECT id, name, depId FROM Titan.user WHERE NOT EXISTS (SELECT userId FROM Titan.checkTime WHERE `;
      absentSql += `start > '${workTime} 05:00:00' AND end < '${nextYear}-${nextMonth}-${nextDay} 04:59:59' ) `;
      absentSql += `AND isAdmin IS FALSE `;
      absentSql += `AND depId NOT IN (SELECT depId FROM Titan.holiday WHERE holiday = '${workTime}')`;
      const absentResult = (await promisePool.query(absentSql))[0];

      const allDepIdSql = "SELECT id FROM Titan.department";
      const depResult = await promisePool.query(allDepIdSql);

      let allDepId = [...depResult[0]];
      let allLateUserInfo = [];

      for (let i = 0; i < allDepId.length; i++) {
        let lateSql = `select * FROM Titan.user INNER JOIN Titan.checkTime ON Titan.user.id = Titan.checkTime.userId `;
        lateSql += `WHERE start > (SELECT CONCAT('${workTime} ', startTime) AS startDate FROM Titan.workTime WHERE depId = ${allDepId[i]["id"]}) `;
        lateSql += `AND start LIKE '${workTime}%'`;

        let depLateResult = (await promisePool.query(lateSql))[0];
        allLateUserInfo = [...allLateUserInfo, ...depLateResult];
      }
      let message = [];

      absentResult.forEach((element) => {
        message.push({
          userId: element.id,
          name: element.name,
          startTime: null,
          late: false,
        });
      });
      allLateUserInfo.forEach((element) => {
        message.push({
          userId: element.id,
          name: element.name,
          startTime: moment(element.start)
            .utc("Asia/Tokyo")
            .format("YYYY-MM-DD HH:mm:ss"),
          late: true,
        });
      });
      res.json({
        status: "200",
        message,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getBlockUser: async (req, res) => {
    try {
      const promisePool = pool.promise();
      const blockSql = `SELECT id, name FROM Titan.user WHERE errCount > 4 AND isAdmin IS FALSE `;
      const blockResult = (await promisePool.query(blockSql))[0];
      const usersInfo = [...blockResult];
      res.json({
        status: "sucess",
        message: usersInfo,
      });
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = adminController;
