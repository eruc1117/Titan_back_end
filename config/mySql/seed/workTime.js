const pool = require("../connect")

initHoliday()

async function initHoliday () {
    try {
        const promisePool = pool.promise()
        let tableSql = "INSERT INTO Titan.workTime (startTime, endTime) VALUES ('10:00:00', '18:30:00')"
        const [rows,fields] = await promisePool.query(tableSql)
    } catch (err) {
        console.log(err)
    } finally {
        pool.end()
    }

} 