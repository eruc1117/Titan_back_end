const pool = require("../connect");

initDepartment();

async function initDepartment() {
  try {
    const promisePool = pool.promise();
    let tableSql = "CREATE TABLE IF NOT EXISTS workTime (";
    tableSql += "id int NOT NULL AUTO_INCREMENT PRIMARY KEY,";
    tableSql += "startTime TIME NOT NULL,";
    tableSql += "endTime TIME NOT NULL,";
    tableSql += "depId INT,";
    tableSql += "FOREIGN KEY (depId)";
    tableSql += "REFERENCES department(id))";
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
