import { Router } from "express";
import fs, { link } from "fs";
import path from "path";
import { checkAuth } from "./authMiddleware";
import { Contact, isValidContact } from "../../../shared/types/Contact";
import { isValidLinksObject, Links } from "../../../shared/types/Links";
import { Settings, isValidSettingsObject } from "@shared/types/Settings";
import { AboutMe, isValidAboutMe } from "@shared/types/AboutMe";

const router = Router();
const contactsFilePath = path.join(__dirname, "..", "config", "contacts.json");
const linksFilePath = path.join(__dirname, "..", "config", "links.json");
const aboutMeFilePath = path.join(__dirname, "..", "config", "aboutMe.json");
const settingsFilePath = path.join(__dirname, "..", "config", "settings.json");

router.put("/contacts/put", checkAuth, (req, res) => {
  const updatedContacts = req.body;

  if (
    !Array.isArray(updatedContacts) ||
    !updatedContacts.every(isValidContact)
  ) {
    return res.status(400).json({ error: "Invalid contact format" });
  }

  fs.readFile(contactsFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read contacts" });
    }

    const contacts = JSON.parse(data);

    updatedContacts.forEach((updatedContact: Contact) => {
      const contactIndex = contacts.findIndex(
        (contact: Contact) => contact.type === updatedContact.type
      );

      if (contactIndex !== -1) {
        contacts[contactIndex] = {
          ...contacts[contactIndex],
          ...updatedContact,
        };
      }
    });

    fs.writeFile(
      contactsFilePath,
      JSON.stringify(contacts, null, 2),
      "utf8",
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to update contacts" });
        }
        res.json({ message: "Contacts updated successfully" });
      }
    );
  });
});

router.put("/links/put", checkAuth, (req, res) => {
  const linksReceived = req.body;

  if (!isValidLinksObject(linksReceived)) {
    return res.status(400).json({ error: "Invalid links format" });
  }

  fs.readFile(linksFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read the links" });
    }

    try {
      const links = JSON.parse(data);
      const updatedLinks = { ...links, ...linksReceived };

      fs.writeFile(
        linksFilePath,
        JSON.stringify(updatedLinks, null, 2),
        "utf8",
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Failed to update the links" });
          }
          res.json({ message: "Links updated successfully" });
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Something went wrong during the links update" });
    }
  });
});

router.put("/settings/put", checkAuth, (req, res) => {
  const settingsReceived = req.body;

  if (!isValidSettingsObject(settingsReceived)) {
    return res.status(400).json({ error: "Invalid settings format" });
  }

  fs.readFile(settingsFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read the links" });
    }

    try {
      const settings = JSON.parse(data);
      const updatedSettings = { ...settings, ...settingsReceived };

      fs.writeFile(
        settingsFilePath,
        JSON.stringify(updatedSettings, null, 2),
        "utf8",
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Failed to update the settings" });
          }
          res.json({ message: "Settings updated successfully" });
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Something went wrong during the settings update" });
    }
  });
});

router.put("/aboutMe/put", checkAuth, (req, res) => {
  const aboutMeReceived = req.body;

  if (!isValidAboutMe(aboutMeReceived)) {
    return res.status(400).json({ error: "Invalid about me format" });
  }

  fs.readFile(aboutMeFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read the about me" });
    }

    try {
      const aboutMe = JSON.parse(data);
      const updatedAboutMe = { ...aboutMe, ...aboutMeReceived };

      fs.writeFile(
        aboutMeFilePath,
        JSON.stringify(updatedAboutMe, null, 2),
        "utf8",
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Failed to update the about me" });
          }
          res.json({ message: "About me updated successfully" });
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Something went wrong during the about me update" });
    }
  });
});

export default router;
