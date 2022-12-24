const express = require("express");
const router = express.Router();
const authentication = require("../../middleware/authentication");
const isAdmin = require("../../middleware/isAdmin");

router.use(authentication);
router.use(isAdmin);
router.get("/test", (req, res) => {
  res.send("test");
});

module.exports = router;
