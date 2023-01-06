const pool = require("../connect");

initCheckTime();

async function initCheckTime() {
  try {
    const promisePool = pool.promise();
    let tableSql = "CREATE TABLE IF NOT EXISTS checkTime (";
    tableSql += "id int NOT NULL AUTO_INCREMENT PRIMARY KEY,";
    tableSql += "userId int NOT NULL,";
    tableSql += "start INT,";
    tableSql += "end INT,";
    tableSql += "FOREIGN KEY (userId)";
    tableSql += "REFERENCES user(id))";
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
