const express = require("express");
const router = express.Router();

const account = require("./module/account");
const checkIn = require("./module/checkIn");
const admin = require("./module/admin");
const handleErr = require("../middleware/handleErr");

router.use("/account", account);
router.use("/checkIn", checkIn);
router.use("/admin", admin);

router.use(handleErr);

module.exports = router;
