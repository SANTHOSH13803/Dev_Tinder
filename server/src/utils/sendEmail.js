// utils/sendEmail.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  const response = await transporter.sendMail({
    from: '"DevTinder Support" <devtinder.app@gmail.com>',
    to,
    subject,
    html
  });
};

module.exports = { sendEmail, transporter };
