const express = require("express");
const router = express.Router();

const account = require("./module/account");
const checkIn = require("./module/checkIn");
const admin = require("./module/admin");

router.use("/account", account);
router.use("/checkIn", checkIn);
router.use("/admin", admin);

module.exports = router;
