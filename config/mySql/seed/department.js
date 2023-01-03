const path = require("path");
const envPath = path.join(__dirname, "../../.env");
require("dotenv").config({ path: envPath });
const pool = require("../connect");

initHoliday();

async function initHoliday() {
  try {
    const promisePool = pool.promise();
    let tableSql =
      "INSERT INTO Titan.department (name) VALUES ('depName1'),('depName2')";
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
