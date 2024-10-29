import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import config from "../config";
import { checkAuth, getUserId } from "./authMiddleware";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { FlatCache } from "flat-cache";

const router = Router();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const cache = new FlatCache();
interface CacheData {
  userId: string;
  expiresAt: number;
}

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await AppDataSource.getRepository(User).findOne({
    where: { username },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    config.jwtSecret,
    {
      expiresIn: "1h",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ message: "Login successful" });
});

router.post("/change-password", checkAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = getUserId(req);

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await userRepository.save(user);
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Failed to change password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

router.get("/verify-token", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return res.json({ user: decoded });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logout successful" });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  cache.setKey(`resetToken:${resetToken}`, {
    userId: user.id,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  const resetURL = `${process.env.FRONTEND_APP_API_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset",
    html: `
      <p>You requested a password reset</p>
      <p>Click <a href="${resetURL}">here</a> to reset your password</p>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    cache.removeKey(`resetToken:${resetToken}`);
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: "Token and new password are required" });
  }

  try {
    const cached = cache.getKey(`resetToken:${token}`) as CacheData | undefined;

    if (!cached) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const { userId, expiresAt } = cached;

    if (Date.now() < expiresAt) {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      user.password = hashedPassword;
      await userRepository.save(user);

      // Delete the token from Redis after successful reset
      await cache.removeKey(`resetToken:${token}`);
      await cache.save();

      res.status(200).json({ message: "Password successfully reset" });
    } else {
      await cache.removeKey(`resetToken:${token}`);
      await cache.save();
      res.status(410).json({ message: "Link has expired" });
    }
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

router.post("/verify-token", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }
  try {
    const cached = cache.getKey(`resetToken:${token}`) as CacheData | undefined;
    const something = cache.getKey(`resetToken:${token}`);

    if (!cached) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const { userId, expiresAt } = cached;

    if (Date.now() < expiresAt) {
      res.status(200).json({ message: "Link ok" });
    } else {
      await cache.removeKey(`resetToken:${token}`);
      await cache.save();
      res.status(410).json({ message: "Link has expired" });
    }
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

export default router;
