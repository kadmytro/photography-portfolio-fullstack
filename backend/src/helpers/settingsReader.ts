import { isValidSettingsObject, Settings } from "@shared/types/Settings";
import path from "path";
import fs from "fs/promises";

const settingsFilePath = path.join(__dirname, "../", "config", "settings.json");

export const readSettings = async (): Promise<Settings | null> => {
  try {
    const data = await fs.readFile(settingsFilePath, "utf8");
    const settings: any = JSON.parse(data);
    
    if (isValidSettingsObject(settings)) {
      return settings as Settings;
    } else {
      console.error("Invalid settings format.");
      return null;
    }
  } catch (error) {
    console.error("Failed to read settings file:", error);
    return null;
  }
};