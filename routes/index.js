const express = require("express")
const router = express.Router()

const account = require("./module/account")

router.use("/account", account)


module.exports = router