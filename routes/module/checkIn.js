const express = require("express");
const router = express.Router();
const checlInController = require("../../controller/checkIn");
const authentication = require("../../middleware/authentication");

router.get("/qrCode/:urlVerCode/:userId", checlInController.qrCodeCheckIn);
router.post("/check", authentication, checlInController.checkIn);
router.post("/preQrCode", authentication, checlInController.preQrcode);

module.exports = router;
