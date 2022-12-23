const pool = require("../config/mySql/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const envPath = path.join(__dirname, "../.env");
const nodemailer = require("nodemailer");
const createVerification = require("../function/createVerification");
require("dotenv").config({ path: envPath });

const accountController = {
  login: async (req, res) => {
    try {
      const promisePool = pool.promise();
      const [account, password] = [req.body.account, req.body.password];
      const sqlCmd = `SELECT id, password FROM user WHERE account = '${account}'`;
      const preSqlResult = (await promisePool.query(sqlCmd))[0];
      if (0 === preSqlResult.length) {
        throw new Error("無此帳號！");
      }
      const dbPassword = preSqlResult[0]["password"];
      const chkResult = await bcrypt.compare(password, dbPassword);
      let resMsg = {
        status: chkResult ? 200 : 400,
        message: {},
      };
      if (chkResult) {
        const token = jwt.sign(
          { id: preSqlResult[0]["id"] },
          process.env.secret,
          { expiresIn: "1d" }
        );

        resMsg.message = {
          login: "true",
          workState: "start",
          token: token,
          admin: false,
        };
      } else {
        resMsg.message = {
          login: "false",
          workState: "logout",
          admin: false,
        };
      }
      res.status(resMsg.status).json(resMsg);
    } catch (err) {
      console.log(err);
      res.status(400).json({ err: "err" });
    }
  },
  preResetPassword: async (req, res) => {
    try {
      const userEmail = req.body.email;
      const [verId, verification] = await createVerification();
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: "eruc11111@gmail.com",
          pass: process.env.googleSecret,
        },
      });

      transporter
        .sendMail({
          from: "eruc11111@gmail.com",
          to: userEmail,
          subject: "密碼重置驗證碼",
          html: `${verId},${verification}`,
        })
        .then((info) => {
          console.log({ info });
        })
        .catch(console.error);
      res.status(200).send("Sucess");
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = accountController;
