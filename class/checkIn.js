const pool = require("../config/mySql/connect")

class CheckIn {
    constructor (depId) {
        this.id = depId
    }

    async getLocationInfo () {
        try {
            const promisePool = pool.promise()
            let sqlCmd = `SELECT latitude, longitude FROM Titan.location `
            sqlCmd += `WHERE depId = ${this.id}`
            const result = await promisePool.query(sqlCmd)
            if (0 === (result[0]).length) {
                throw new Error ("Department Id 錯誤!")
            }
            return {
                location:result[0][0]
            }
    } catch (err) {
        console.log(err)
    }
    }

    async gpsPunch (userId, time, location) {
        // time 寫入 db
        // return {
        //     test : true
        // } || 
        // {
        //    test : false
        // }
    }

    async qrCodePunch (userId, time) {
        // time 寫入 db
        // return {
        //     test : true
        // } || 
        // {
        //    test : false
        // }
    }
}

module.exports = CheckIn