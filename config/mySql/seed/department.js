const pool = require("../connect")

initHoliday()

async function initHoliday () {
    try {
        const promisePool = pool.promise()
        let tableSql = "INSERT INTO Titan.department (name, workTimeId) VALUES ('鈦坦科技', 1)"
        const [rows,fields] = await promisePool.query(tableSql)
    } catch (err) {
        console.log(err)
    } finally {
        pool.end()
    }

} 