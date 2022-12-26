const express = require("express");
const router = express.Router();
const checlInController = require("../../controller/checkIn");
const authentication = require("../../middleware/authentication");

router.get("/qrCode", (req, res) => {
  res.send("test");
});
router.get("/qrCode/:urlVerCode/:userId", checlInController.qrCodeCheckIn);
router.use(authentication);
router.post("/check", checlInController.checkIn);
router.get("/preQrCode/:userId", checlInController.preQrcode);

module.exports = router;
