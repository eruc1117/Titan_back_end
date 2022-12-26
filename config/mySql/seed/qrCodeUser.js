const pool = require("../connect");

initqrCodeUser();

async function initqrCodeUser() {
  try {
    const promisePool = pool.promise();
    let tableSql =
      "INSERT INTO Titan.qrCodeUser (userId) SELECT id FROM Titan.user WHERE isAdmin IS false";
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
