const pool = require("../connect")

initUser()

async function initUser () {
    try {
        const promisePool = pool.promise()
        let tableSql = "CREATE TABLE IF NOT EXISTS user ("
        tableSql += "id int NOT NULL AUTO_INCREMENT PRIMARY KEY,"
        tableSql += "depId int NOT NULL,"
        tableSql += "name NVARCHAR(50),"
        tableSql += "email VARCHAR(100),"
        tableSql += "account VARCHAR(50) NOT NULL,"
        tableSql += "password VARCHAR(255) NOT NULL,"
        tableSql += "errCount int,"
        tableSql += "isAdmin BOOLEAN,"
        tableSql += "FOREIGN KEY (depId)"
        tableSql += "REFERENCES department(id))"
        const [rows,fields] = await promisePool.query(tableSql)
    } catch (err) {
        console.log(err)
    } finally {
        pool.end()
    }
} 