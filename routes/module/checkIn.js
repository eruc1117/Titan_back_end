const express = require("express");
const router = express.Router();
const checlInController = require("../../controller/checkIn");
const authentication = require("../../middleware/authentication");

router.use(authentication);
router.post("/check", checlInController.checkIn);

module.exports = router;
