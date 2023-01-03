const pool = require("../connect");

initWorkTime();

async function initWorkTime() {
  try {
    const promisePool = pool.promise();
    let tableSql =
      "INSERT INTO workTime (startTime, endTime, depId) VALUES ('10:00:00', '18:30:00', 1), ('10:00:00', '18:30:00', 11)";
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
