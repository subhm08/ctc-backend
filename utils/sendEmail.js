// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MANAGER_EMAIL,      // your clinic email
      pass: process.env.MANAGER_EMAIL_PASS  // app password (NOT your Gmail password)
    }
  });

  await transporter.sendMail({
    from: `"Care to Cure Clinic" <${process.env.MANAGER_EMAIL}>`,
    to,
    subject,
    html: htmlContent
  });
};

module.exports = sendEmail;

