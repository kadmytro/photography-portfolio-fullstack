import { Router } from "express";
import { checkAuth } from "./authMiddleware";
import { isValidLinksObject } from "../../../shared/types/Links";
import { isValidSettingsObject } from "@shared/types/Settings";
import { isValidAboutMe } from "@shared/types/AboutMe";
import { saveOrUpdateSetting } from "../helpers/setttingsService";

const router = Router();

router.put("/contacts/put", checkAuth, async (req, res) => {
  const updatedContacts = req.body;

  if (!Array.isArray(updatedContacts)) {
    return res.status(400).json({ error: "Invalid contact format" });
  }

  try {
    await saveOrUpdateSetting("contacts", updatedContacts);
    res.json({ message: "Contacts updated successfully" });
  } catch (error) {
    console.error("Error updating contacts:", error);
    res.status(500).json({ error: "Failed to update contacts" });
  }
});

router.put("/terms/put", checkAuth, async (req, res) => {
  const updatedTerms = req.body;

  try {
    await saveOrUpdateSetting("terms", updatedTerms);
    res.json({ message: "Terms updated successfully" });
  } catch (error) {
    console.error("Error updating terms:", error);
    res.status(500).json({ error: "Failed to update tersm" });
  }
});

router.put("/links/put", checkAuth, async (req, res) => {
  const updatedLinks = req.body;

  if (!isValidLinksObject(updatedLinks)) {
    return res.status(400).json({ error: "Invalid links format" });
  }

  try {
    await saveOrUpdateSetting("links", updatedLinks);
    res.json({ message: "Links updated successfully" });
  } catch (error) {
    console.error("Error updating links:", error);
    res.status(500).json({ error: "Failed to update links" });
  }
});

router.put("/gallerySettings/put", checkAuth, async (req, res) => {
  const updatedSettings = req.body;

  if (!isValidSettingsObject(updatedSettings)) {
    return res.status(400).json({ error: "Invalid settings format" });
  }

  try {
    await saveOrUpdateSetting("gallerySettings", updatedSettings);
    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

router.put("/aboutMe/put", checkAuth, async (req, res) => {
  const updatedAboutMe = req.body;

  if (!isValidAboutMe(updatedAboutMe)) {
    return res.status(400).json({ error: "Invalid about me format" });
  }

  try {
    await saveOrUpdateSetting("aboutMe", updatedAboutMe);
    res.json({ message: "About Me updated successfully" });
  } catch (error) {
    console.error("Error updating aboutMe:", error);
    res.status(500).json({ error: "Failed to update about me" });
  }
});

export default router;
