const express = require("express");
const router = express.Router();
const authentication = require("../../middleware/authentication");
const adminController = require("../../controller/admin");
const isAdmin = require("../../middleware/isAdmin");

router.use(authentication);
router.use(isAdmin);
router.post("/test", adminController.getAbsentUser);

module.exports = router;
