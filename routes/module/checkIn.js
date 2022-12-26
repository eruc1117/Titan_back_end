const express = require("express");
const router = express.Router();
const checlInController = require("../../controller/checkIn");
const authentication = require("../../middleware/authentication");

router.use(authentication);
router.post("/check", checlInController.checkIn);
router.get("/preQrCode/:userId", checlInController.preQrcode);

module.exports = router;
