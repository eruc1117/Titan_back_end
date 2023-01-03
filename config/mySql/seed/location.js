const pool = require("../connect");

initLocation();

async function initLocation() {
  try {
    const promisePool = pool.promise();
    let tableSql =
      "INSERT INTO location (depId, latitude, longitude) VALUES (1, 24.810108242470402, 120.97515335571487), (11, 24.770954401814272, 121.22081127397003)";
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
