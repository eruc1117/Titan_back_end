const pool = require("../connect")

initLocation()

async function initLocation () {
    try {
        const promisePool = pool.promise()
        let tableSql = "CREATE TABLE IF NOT EXISTS location ("
        tableSql += "id int NOT NULL AUTO_INCREMENT PRIMARY KEY,"
        tableSql += "depId int NOT NULL,"
        tableSql += "latitude DOUBLE NOT NULL,"
        tableSql += "longitude DOUBLE NOT NULL,"
        tableSql += "FOREIGN KEY (depId)"
        tableSql += "REFERENCES department(id))"
        const [rows,fields] = await promisePool.query(tableSql)
    } catch (err) {
        console.log(err)
    } finally {
        pool.end()
    }
} 