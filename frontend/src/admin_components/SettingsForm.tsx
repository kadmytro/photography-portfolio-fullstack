import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import { Settings } from "@shared/types/Settings";
import LoadingWheel from "../components/LoadingWheel";
import MultiSelectDropdown from "./Category";

const SettingsForm: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    homeMaxPhotos: 0,
    galleryMaxPhotos: 0,
    gallerySelectedCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/api/details/settings");
        setSettings(response.data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field: keyof Settings, value: string) => {
    const parsedValue =
      field === "homeMaxPhotos" || field === "galleryMaxPhotos"
        ? Number(value)
        : value;

    setSettings((prevSettings) => ({
      ...prevSettings,
      [field]: parsedValue,
    }));
  };

  const handleMultiSelectChange = (categories: number[]) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      gallerySelectedCategories: categories,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !settings.homeMaxPhotos ||
      !settings.galleryMaxPhotos ||
      !settings.gallerySelectedCategories?.length
    ) {
      setError("All fields must be filled out.");
      return;
    }

    setError(null); // Clear any previous errors

    try {
      await api.put("/api/admin/settings/put", settings, {
        withCredentials: true,
      });
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Failed to update settings:", error);
      alert("Failed to update settings");
    }
  };

  if (loading) {
    return <LoadingWheel />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 bg-white rounded shadow"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="mb-4">
        <label
          htmlFor="homeMaxPhotos"
          className="block text-gray-700 font-bold mb-2"
        >
          Home max photos
        </label>
        <input
          type="number"
          id="homeMaxPhotos"
          value={settings.homeMaxPhotos}
          onChange={(e) => handleChange("homeMaxPhotos", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="galleryMaxPhotos"
          className="block text-gray-700 font-bold mb-2"
        >
          Gallery max photos
        </label>
        <input
          type="number"
          id="galleryMaxPhotos"
          value={settings.galleryMaxPhotos}
          onChange={(e) => handleChange("galleryMaxPhotos", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <MultiSelectDropdown
          initialSelection={settings.gallerySelectedCategories}
          onSelectionChange={handleMultiSelectChange}
        />
      </div>
      <button
        type="submit"
        disabled={!user}
        className={`w-full py-2 px-4 font-bold text-white rounded ${
          user
            ? "bg-blue-500 hover:bg-blue-700"
            : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        Update Settings
      </button>
    </form>
  );
};

export default SettingsForm;
