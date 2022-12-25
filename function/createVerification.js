const pool = require("../config/mySql/connect");

const createVerification = async () => {
  try {
    const randomNum = Math.floor(Math.random() * 999);
    const promisePool = pool.promise();
    let insertSql = `INSERT INTO verification (verification) VALUES (${randomNum});`;
    const result = (await promisePool.query(insertSql))[0];
    return [result.insertId, randomNum];
  } catch (err) {
    console.log(err);
  }
};

module.exports = createVerification;
