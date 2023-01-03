const pool = require("../connect");

initHoliday();

async function initHoliday() {
  try {
    const promisePool = pool.promise();
    let tableSql = "CREATE TABLE IF NOT EXISTS holiday (";
    tableSql += "id int NOT NULL AUTO_INCREMENT PRIMARY KEY,";
    tableSql += "depId int NOT NULL,";
    tableSql += "holiday DATETIME NOT NULL,";
    tableSql += "FOREIGN KEY (depId)";
    tableSql += "REFERENCES department(id))";
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
