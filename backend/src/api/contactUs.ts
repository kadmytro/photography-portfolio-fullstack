import { Router } from "express";
import { AppDataSource } from "../data-source";
import { ContactRequest } from "../entity/ContactRequest";
import { checkAuth } from "./authMiddleware";
import nodemailer from "nodemailer";

const router = Router();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post("/send", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contactRequest = new ContactRequest();
    contactRequest.name = name;
    contactRequest.email = email;
    contactRequest.subject = subject;
    contactRequest.message = message;

    const contactRequestsRepo = AppDataSource.getRepository(ContactRequest);
    await contactRequestsRepo.save(contactRequest);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_US_EMAIL,
      subject: `Message from ${name}`,
      html: `
        <p>You received a new message</p>
        <p>From: ${name} &lt;${email}&gt;</p>
        <p>Subject: ${subject}</p>
        <p>Message: ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent" });
    res.status(201).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to send the form" });
  }
});

router.get("/", checkAuth, async (req, res) => {
  const messages = await AppDataSource.getRepository(ContactRequest).find({
    order: { date: "DESC" },
  });
  res.json(messages);
});

router.get("/regular", checkAuth, async (req, res) => {
  const messages = await AppDataSource.getRepository(ContactRequest).find({
    where: { isArchived: false, isDeleted: false },
    order: { date: "DESC" },
  });
  res.json(messages);
});

router.get("/archived", checkAuth, async (req, res) => {
  const messages = await AppDataSource.getRepository(ContactRequest).find({
    where: { isArchived: true, isDeleted: false },
    order: { date: "DESC" },
  });
  res.json(messages);
});

router.get("/deleted", checkAuth, async (req, res) => {
  const messages = await AppDataSource.getRepository(ContactRequest).find({
    where: { isDeleted: true },
    order: { date: "DESC" },
  });
  res.json(messages);
});

router.put("/putMany", checkAuth, async (req, res) => {
  try {
    const messagesChanges = req.body;
    if (!Array.isArray(messagesChanges) || messagesChanges.length === 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const contactRequestRepository =
      AppDataSource.getRepository(ContactRequest);

    const updatePromises = messagesChanges.map((update) => {
      const { id, ...fieldsToUpdate } = update;

      if (fieldsToUpdate.hasOwnProperty("isForeverDeleted")) {
        return contactRequestRepository.delete(id);
      }

      fieldsToUpdate["deletedDate"] =
        fieldsToUpdate.hasOwnProperty("isDeleted") &&
        fieldsToUpdate["isDeleted"]
          ? new Date()
          : null;

      return contactRequestRepository.update(id, fieldsToUpdate);
    });

    await Promise.all(updatePromises);

    return res
      .status(200)
      .json({ message: "ContactRequests updated successfully" });
  } catch (error) {
    console.error("Error updating contact requests", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
