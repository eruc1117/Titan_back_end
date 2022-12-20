const CheckIn = require("./checkIn")

class User extends CheckIn {
    constructor (userId) {
        this.id = userId
    }

    async userGpsPunch () {
        return  super.gpsPunch(this.id)
    }

    async userQrCodePunch () {
        return  super.qrCodePunch(this.id)
    }
}