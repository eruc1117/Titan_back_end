const express = require("express");
const router = express.Router();
const accountController = require("../../controller/account");
const authentication = require("../../middleware/authentication");

router.post("/login", accountController.login);
router.post("/preReset", accountController.preResetPassword);
router.post("/reset", accountController.resetPassword);
router.get(
  "/froontEndRouter",
  authentication,
  accountController.frontEndRouter
);

module.exports = router;
