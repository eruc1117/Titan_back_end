const pool = require("../connect");

initVerification();

async function initVerification() {
  try {
    const promisePool = pool.promise();
    let tableSql = "CREATE TABLE IF NOT EXISTS verification (";
    tableSql += "id int NOT NULL AUTO_INCREMENT PRIMARY KEY,";
    tableSql += "verification INT NOT NULL)";
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
