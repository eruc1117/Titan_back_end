

const pool = require("../connect")

initDepartment()

async function initDepartment () {
    try {
        const promisePool = pool.promise()
        let tableSql ="CREATE TABLE IF NOT EXISTS department ("
        tableSql += "id int NOT NULL AUTO_INCREMENT PRIMARY KEY,"
        tableSql += "startTime DATETIME NOT NULL,"
        tableSql += "endTime DATETIME NOT NULL,"
        tableSql += "rangeTime int)"
        const [rows,fields] = await promisePool.query(tableSql)
        console.log([rows,fields])
    } catch (err) {
        console.log(err)
    } finally {
        pool.end()
    }

}
