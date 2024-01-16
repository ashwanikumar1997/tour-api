const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "emilia76@ethereal.email",
    pass: "byyteceBqdwWxUuNzc",
  },
});

module.exports = transporter;
