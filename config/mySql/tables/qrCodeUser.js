const pool = require("../connect");

initDepartment();

async function initDepartment() {
  try {
    const promisePool = pool.promise();
    let tableSql = "CREATE TABLE IF NOT EXISTS qrCodeUser (";
    tableSql += "id int NOT NULL AUTO_INCREMENT PRIMARY KEY,";
    tableSql += "userId INT NOT NULL,";
    tableSql += "FOREIGN KEY (userId)";
    tableSql += "REFERENCES user(id))";
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
