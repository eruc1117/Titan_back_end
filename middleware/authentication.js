const jwt = require("jsonwebtoken");
const path = require("path");
const envPath = path.join(__dirname, "../.env");
require("dotenv").config({ path: envPath });

const authentication = async (req, res, next) => {
  try {
    const authToken = req.headers["authorization"].replace("Bearer ", "");
    const decoded = await jwt.verify(authToken, process.env.secret);
    req.middlewarePassData = {
      userId: decoded.id,
      isAdmin: decoded.isAdmin,
    };
    next();
  } catch (err) {
    console.log(err);
    res.send("Token is wrong !!");
  }
};

module.exports = authentication;
