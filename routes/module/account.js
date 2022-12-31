const express = require("express");
const router = express.Router();
const accountController = require("../../controller/account");

router.post("/login", accountController.login);
router.post("/preReset", accountController.preResetPassword);
router.post("/reset", accountController.resetPassword);

module.exports = router;
