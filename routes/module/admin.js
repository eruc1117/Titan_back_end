const express = require("express");
const router = express.Router();
const authentication = require("../../middleware/authentication");
const adminController = require("../../controller/admin");
const isAdmin = require("../../middleware/isAdmin");

router.use(authentication);
router.use(isAdmin);
router.post("/absent", adminController.getAbsentUser);
router.get("/block", adminController.getBlockUser);
router.post("/cancel/block", adminController.cancelBlockUser);
router.post("/cancel/absent", adminController.cancelAbsentUser);

module.exports = router;
