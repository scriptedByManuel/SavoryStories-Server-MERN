const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const sendEmail = async ({ viewFile, from, to, subject, data }) => {
  try {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const templatePath = path.join(__dirname, '..', 'views', `${viewFile}.ejs`);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templatePath}`);
    }

    const html = await ejs.renderFile(templatePath, data);
    const info = await transport.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Mailtrap email error:", error);
  }
};

console.log(__dirname)

module.exports = sendEmail;
