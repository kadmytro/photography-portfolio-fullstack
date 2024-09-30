import { Router } from "express";
import { AppDataSource } from "../data-source";
import { ContactRequest } from "../entity/ContactRequest";

const router = Router();
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

    res.status(201).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to send the form" });
  }
});

export default router;
