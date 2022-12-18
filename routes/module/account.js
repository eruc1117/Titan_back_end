const express = require("express")
const router = express.Router()
const accountController = require("../../controller/account")

router.post("/login", accountController.login)

module.exports = router