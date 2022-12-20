const express = require("express")
const router = express.Router()
const accountController = require("../../controller/account")
const authentication = require("../../middleware/authentication")

router.post("/login", accountController.login)
router.use(authentication)


module.exports = router