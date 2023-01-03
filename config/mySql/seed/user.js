const bcrypt = require("bcrypt");
const pool = require("../connect");

createUserData(2);

async function createUserData(number) {
  try {
    const promisePool = pool.promise();
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const oriPassword = "titaner";
    const password = await bcrypt.hash(oriPassword, salt);
    const oriAdminPassword = "tiadmin";
    const adminPassword = await bcrypt.hash(oriAdminPassword, salt);
    let tableSql =
      "INSERT INTO user (depId, name, email, account, password, isAdmin, errCount) VALUES ";
    for (let i = 0; i < number; i++) {
      tableSql += `(${
        i + 1
      }, 'user${i}', 'eruc101010@gmail.com', 'user${i}', '${password}', false, 0),`;
    }
    tableSql += `(1, 'admin', 'eruc101010@gmail.com', 'admin', '${adminPassword}', true,0)`;
    const [rows, fields] = await promisePool.query(tableSql);
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
