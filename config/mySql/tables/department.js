const pool = require("../connect");

initDepartment();

async function initDepartment() {
  try {
    const promisePool = pool.promise();
    let tableSql = "CREATE TABLE IF NOT EXISTS department (";
    tableSql += "id int NOT NULL AUTO_INCREMENT PRIMARY KEY,";
    tableSql += "name NVARCHAR(100),";
    tableSql += "rangeMin INT";
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
