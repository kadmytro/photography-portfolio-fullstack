import { Router } from "express";
import fs from "fs";
import path from "path";
import { checkAuth } from "./authMiddleware";

const router = Router();
const contactsFilePath = path.join(__dirname, "..", "config", "contacts.json");
const linksFilePath = path.join(__dirname, "..", "config", "links.json");
const aboutMeFilePath = path.join(__dirname, "..", "config", "aboutMe.json");
const settingsFilePath = path.join(__dirname, "..", "config", "settings.json");

router.get("/contacts", (req, res) => {
  fs.readFile(contactsFilePath, "utf8", (err, data) => {
    if (err) {
      console.log(`tried to read the ${contactsFilePath}`);
      return res.status(500).json({ error: "Failed to read contacts" });
    }
    res.json(JSON.parse(data));
  });
});

router.get("/links", (req, res) => {
  fs.readFile(linksFilePath, "utf8", (err, data) => {
    if (err) {
      console.log(`tried to read the ${linksFilePath}`);
      return res.status(500).json({ error: "Failed to read links" });
    }
    res.json(JSON.parse(data));
  });
});

router.get("/aboutMe", (req, res) => {
  fs.readFile(aboutMeFilePath, "utf8", (err, data) => {
    if (err) {
      console.log(`tried to read the ${aboutMeFilePath}`);
      return res.status(500).json({ error: "Failed to read about me" });
    }
    res.json(JSON.parse(data));
  });
});

router.get("/settings", checkAuth, (req, res) => {
  fs.readFile(settingsFilePath, "utf8", (err, data) => {
    if (err) {
      console.log(`tried to read the ${settingsFilePath}`);
      return res.status(500).json({ error: "Failed to read links" });
    }
    res.json(JSON.parse(data));
  });
});

export default router;
