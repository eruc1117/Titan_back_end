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
      let absentSql = `SELECT id, name, depId FROM user WHERE NOT EXISTS (SELECT userId FROM checkTime WHERE `;
      absentSql += `start > '${workTime} 05:00:00' AND end < '${nextYear}-${nextMonth}-${nextDay} 04:59:59' ) `;
      absentSql += `AND isAdmin IS FALSE `;
      absentSql += `AND depId NOT IN (SELECT depId FROM holiday WHERE holiday = '${workTime}')`;
      const absentResult = (await promisePool.query(absentSql))[0];

      const allDepIdSql = "SELECT id FROM department";
      const depResult = await promisePool.query(allDepIdSql);

      let allDepId = [...depResult[0]];
      let allLateUserInfo = [];

      for (let i = 0; i < allDepId.length; i++) {
        let lateSql = `select * FROM user INNER JOIN checkTime ON user.id = checkTime.userId `;
        lateSql += `WHERE start > (SELECT CONCAT('${workTime} ', startTime) AS startDate FROM workTime WHERE depId = ${allDepId[i]["id"]}) `;
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
      const blockSql = `SELECT id, name FROM user WHERE errCount > 4 AND isAdmin IS FALSE `;
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
  cancelBlockUser: async (req, res) => {
    try {
      const userId = req.body.userId;
      const promisePool = pool.promise();
      const cancelSql = `UPDATE user SET errCount = 0 WHERE id = ${userId} AND isAdmin IS FALSE `;
      const result = (await promisePool.query(cancelSql))[0];
      if (result.affectedRows === 1) {
        res.json({
          status: "200",
          message: "sucess",
        });
      } else {
        res.json({
          status: "200",
          message: "fail",
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  cancelAbsentUser: async (req, res) => {
    try {
      const { userId, isLate, workTime } = req.body;
      const promisePool = pool.promise();
      let cancelSql = ``;
      if (isLate) {
        cancelSql = `UPDATE checkTime SET `;
        cancelSql += `start = CONCAT('${workTime} ', (SELECT startTime FROM workTime WHERE depId = ( SELECT depId FROM user WHERE id = ${userId}))),`;
        cancelSql += `end = CONCAT('${workTime} ', (SELECT endTime FROM workTime WHERE depId = ( SELECT depId FROM user WHERE id = ${userId})))`;
        cancelSql += `WHERE userId = ${userId} AND start Like '${workTime}%'`;
      } else {
        cancelSql = `INSERT INTO checkTime (userId, start, end) VALUES (`;
        cancelSql += `${userId}, CONCAT('${workTime} ', (SELECT startTime FROM workTime WHERE depId = ( SELECT depId FROM user WHERE id = ${userId}))),`;
        cancelSql += `CONCAT('${workTime} ', (SELECT endTime FROM workTime WHERE depId = ( SELECT depId FROM user WHERE id = ${userId}))))`;
      }
      const result = (await promisePool.query(cancelSql))[0];
      if (result.affectedRows === 1) {
        res.json({
          status: "200",
          message: "sucess",
        });
      } else {
        res.json({
          status: "200",
          message: "fail",
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = adminController;
