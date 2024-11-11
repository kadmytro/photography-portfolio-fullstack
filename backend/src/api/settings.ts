import { Router } from "express";
import { getSetting } from "../helpers/setttingsService";

const router = Router();

router.get("/:key", async (req, res) => {
  const { key } = req.params;

  try {
    const setting = await getSetting(key);
    if (setting !== null) {
      res.json(setting);
    } else {
      res.status(404).json({ error: `Setting with key '${key}' not found` });
    }
  } catch (error) {
    console.error(`Error fetching setting for key '${key}':`, error);
    res.status(500).json({ error: "Failed to fetch setting" });
  }
});

export default router;
