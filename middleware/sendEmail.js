const nodemailer = require('nodemailer');
require('dotenv').config();

// Sukuriame transportą su Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true, // svarbu kai port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendNewPassword(email, newPassword) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Jūsų naujas slaptažodis',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 16px;">
          <p>Sveiki,</p>
          <p>Jūsų naujas slaptažodis yra:</p>
          <p style="font-size: 20px; font-weight: bold; color: #2d3748;">🔐 ${newPassword}</p>
          <p>Galite prisijungti prie sistemos:</p>
          <p><a href="http://localhost:5173/login" style="color: #3182ce;">Prisijungti</a></p>
          <p>🐙 <b>Aštuonkojis linki sėkmės!</b></p>
        </div>
      `,
    });

    console.log('Laiškas išsiųstas:', info.response);
    return true;
  } catch (error) {
    console.error('Klaida siunčiant laišką:', error);
    return false;
  }
}

module.exports = sendNewPassword;
