class CheckIn {
    constructor (depId) {
        this.depLocation = (this.getInfo(depId))["location"]
    }

    async getInfo (depId) {
        // let sql = ""
        // let result = sql
        // return {
        //     location: [123, 1233]
        // }
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