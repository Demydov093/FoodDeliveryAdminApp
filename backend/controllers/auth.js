const logger = require("../utils/logger");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendEmailWithRetry } = require("../utils/emailQueue");

async function signUp(req, res) {
  const { email, password, phone } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email already exist!" });

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashPassword, phone },
    });

    const token = jwt.sign({ userId: user?.id }, process.env.JWT_SECRET);

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
      to: user?.email,
      subject: "Welcome to Food Delivery",
      html: `
        <div style="background:#f7f7f7;padding:40px 0;font-family:Arial, sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            
            <div style="background:#ff6b35;padding:20px;text-align:center;color:#ffffff;">
            <h1 style="margin:0;font-size:28px;">Welcome to Food Delivery! 🍔</h1>
            </div>

            <div style="padding:30px;">
            <p style="font-size:16px;color:#333;margin:0 0 15px 0;">
                Hi <strong>${user?.name || "there"}</strong>,
            </p>

            <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 20px 0;">
                We’re excited to have you on board! 🚀  
                Now you can browse restaurants, order your favorite meals, and get them delivered straight to your doorstep.
            </p>

            <p style="font-size:16px;color:#333;line-height:1.6;margin:0;">
                If you have any questions, we’re always here to help!
            </p>
            </div>

            <div style="background:#f0f0f0;padding:15px;text-align:center;font-size:12px;color:#777;">
            © ${new Date().getFullYear()} Food Delivery. All rights reserved.
            </div>

        </div>
        </div>
    `,
    };

    sendEmailWithRetry(mailOptions).catch((error) =>
      logger.error(`Failed to send welcome email to ${user?.email} `, error)
    );
    res.json({ user, token });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password)
      return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user?.id }, process.env.JWT_SECRET);

    res.json({ user, token });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

module.exports = { signUp, login };
