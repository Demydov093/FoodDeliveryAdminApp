const logger = require("./logger");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.EMAIL_PASS}`,
  },
});

transporter.verify((error, success) => {
  if (error) {
    logger.error("Email transporter erro", error);
  } else {
    logger.info("Email transporter is ready");
  }
});

async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
  for (let retry = 0; retry <= maxRetries; retry++) {
    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${mailOptions.subject} `);
      return;
    } catch (error) {
      logger.error(`Email try ${retry} failed ${error}`);
      if (retry === maxRetries) throw error;
    }
  }
}

module.exports = { sendEmailWithRetry, transporter };
