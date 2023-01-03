const pool = require("../connect");

initHoliday();

async function initHoliday() {
  try {
    const promisePool = pool.promise();
    let tableSql =
      "INSERT INTO department (id, name) VALUES (1, 'depName1'),(11, 'depName2')";
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
