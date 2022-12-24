const fs = require("fs/promises");
const path = require("path");
const pool = require("../../connect");

const inputFile = path.resolve(__dirname, "./holiday_export.json");

const importHoliday = async (depId) => {
  try {
    const holidayJson = await fs.readFile(inputFile, { encoding: "utf8" });
    const holiday = JSON.parse(holidayJson);
    const promisePool = pool.promise();
    let sqlCmd = `INSERT INTO holiday (depId, holiday) VALUES `;
    holiday.forEach((element) => {
      if (element["是否放假"] === "2") {
        sqlCmd += `(${depId}, '${element["西元日期"]}'),`;
      }
    });
    sqlCmd = sqlCmd.substring(0, sqlCmd.length - 1);
    await promisePool.query(sqlCmd);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end;
  }
};

importHoliday(1);
