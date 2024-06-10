const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { verifyPassword, hashPassword } = require("../utils/passwordUtils");

const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const sendEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "nahom6297@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "nahom6297@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Please use the following link to reset your password: http://localhost:5173/resetPassword/${token}`,
  };

  await transporter.sendMail(mailOptions);
};

const resetLinkSend = async (req, res) => {
  const { email } = req.body;
  console.log("email is: ", email);
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const token = generateToken();
    const expiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await prisma.resetToken.create({
      data: {
        token,
        expiry,
        user: { connect: { id: user.id } },
      },
    });

    await sendEmail(email, token);

    res.json({ message: "Reset link sent successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const passChanged = true;
  try {
    const resetRecord = await prisma.resetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord) {
      return res.send({ message: "Invalid token" });
    }

    if (new Date() > resetRecord.expiry) {
      return res.send({ message: "Expired token" });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword, passChanged: passChanged },
    });

    await prisma.resetToken.delete({ where: { token } });

    res.status(200).send({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  resetLinkSend,
  resetPassword,
};
