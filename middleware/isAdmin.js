const jwt = require("jsonwebtoken");
const path = require("path");
const envPath = path.join(__dirname, "../.env");
require("dotenv").config({ path: envPath });

const authentication = async (req, res, next) => {
  try {
    const isAdmin = req.middlewarePassData.isAdmin;
    if (isAdmin === 0) {
      throw new Error("不是管理者");
    }
    next();
  } catch (err) {
    res.send(" 不是管理者 !!");
  }
};

module.exports = authentication;
