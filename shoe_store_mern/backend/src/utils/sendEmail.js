const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOTPEmail(toEmail, otp) {
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'StepUp Shoes'}" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Your StepUp Shoes Verification Code',
      text: `Your OTP code is: ${otp} (valid for 10 minutes)`,
    });
    return true;
  } catch (err) {
    console.error('Mailer error:', err.message);
    return false;
  }
}

module.exports = { sendOTPEmail };
