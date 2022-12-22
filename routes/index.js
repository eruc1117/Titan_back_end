const express = require("express");
const router = express.Router();

const account = require("./module/account");
const checkIn = require("./module/checkIn");

router.use("/account", account);
router.use("/checkIn", checkIn);

module.exports = router;
