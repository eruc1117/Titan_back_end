const pool = require("../config/mySql/connect");

const createVerification = async () => {
  try {
    const randomNum = Math.floor(Math.random() * 999);
    const promisePool = pool.promise();
    let insertSql = `
      INSERT INTO verification (verification) VALUES (${randomNum});`;
    //LAST_INSERT_ID()
    let sqlCmd = `SELECT id FROM verification WHERE verification = ${randomNum}`;
    await promisePool.query(insertSql);
    const result = await promisePool.query(sqlCmd);
    return [result[0][0]["id"], randomNum];
  } catch (err) {
    console.log(err);
  }
};

module.exports = createVerification;
