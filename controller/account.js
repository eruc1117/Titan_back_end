const pool = require("../config/mySql/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const envPath = path.join(__dirname, "../.env");
const nodemailer = require("nodemailer");
const User = require("../class/user");
const createVerification = require("../function/createVerification");
require("dotenv").config({ path: envPath });

const accountController = {
  login: async (req, res) => {
    try {
      const promisePool = pool.promise();
      const [account, password] = [req.body.account, req.body.password];
      const sqlCmd = `SELECT id, password, errCount FROM user WHERE account = '${account}'`;
      const preSqlResult = (await promisePool.query(sqlCmd))[0];
      if (0 === preSqlResult.length) {
        throw new Error("無此帳號！");
      }
      const dbPassword = preSqlResult[0]["password"];
      if (preSqlResult[0]["errCount"] > 4) {
        throw new Error("密碼輸入錯誤超過五次");
      }
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
        const updateErrCount = `UPDATE user SET errCount = ${
          preSqlResult[0]["errCount"] + 1
        } WHERE account = '${account}'`;
        await promisePool.query(updateErrCount);
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
      const userId = req.body.id;
      const employee = new User(userId);
      const employeeEmail = await employee.getEmail();
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
          to: employeeEmail,
          subject: "密碼重置驗證碼",
          html: `${verId},${verification}`,
        })
        .catch(console.error);
      res.status(200).send("Sucess");
    } catch (err) {
      console.log(err);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { userId, newPassword, rePeatPassword, captcha } = req.body;
      const verificationId = captcha.split(",")[0];
      const verification = captcha.split(",")[1];
      const employee = new User(userId);
      if (newPassword !== rePeatPassword) {
        res.send("not equals");
      }
      const resetResult = await employee.updatePassword(
        verificationId,
        verification,
        userId,
        newPassword
      );
      let msg = {
        status: false,
        msg: "",
      };
      if (resetResult.status) {
        msg.status = resetResult.status;
        msg.msg = "sucess";
      } else {
        msg.status = resetResult.status;
        msg.msg = "fail";
      }
      res.json({ status: "200", msg });
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = accountController;
