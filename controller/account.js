const pool = require("../config/mySql/connect")
const bcrypt = require('bcrypt')

const accountController = {
    login: async (req, res) => {
        try {
        const promisePool = pool.promise()
        const [account, password] = [req.body.account, req.body.password]
        const sqlCmd = `SELECT password FROM user WHERE account = '${account}'`
        const preSqlResult = await promisePool.query(sqlCmd)
        const dbPassword = preSqlResult[0][0]["password"]
        const chkResult = await bcrypt.compare(password, dbPassword)
        let resMsg = {
            "status": chkResult ? 200 : 400,
            message: {}
        }
        if (chkResult) {
            resMsg.message = {
                "login": "true",
                "workState": "start",
                "admin": false
            }
        } else {
            resMsg.message = {
                "login": "false",
                "workState": "start",
                "admin": false
            }
        }
        resMsg = JSON.stringify(resMsg)
        res.json(resMsg)
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = accountController