import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import { Settings } from "@shared/types/Settings";
import LoadingWheel from "../components/LoadingWheel";
import Input from "../base_components/Input";
import Button from "../base_components/Button";
import TagBox from "../base_components/TagBox";

const SettingsForm: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    homeMaxPhotos: 0,
    galleryMaxPhotos: 0,
    gallerySelectedCategories: [],
  });

  const [changedSettings, setChangedSettings] = useState<Settings>(settings);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/api/details/settings");
        setSettings(response.data);
        setChangedSettings(response.data);
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

    setChangedSettings((prevSettings) => ({
      ...prevSettings,
      [field]: parsedValue,
    }));
  };

  const handleMultiSelectChange = (categories: (number | string)[]) => {
    setChangedSettings((prevSettings) => ({
      ...prevSettings,
      gallerySelectedCategories: categories,
    }));
  };

  const handleEdit = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setChangedSettings(settings);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
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
      await api.put("/api/admin/settings/put", changedSettings, {
        withCredentials: true,
      });
      setSettings(changedSettings);
    } catch (error) {
      console.error("Failed to update settings:", error);
      alert("Failed to update settings");
    } finally {
      setIsEditing(false);
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingWheel />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 bg-card text-cardText relative rounded shadow"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {saving && (
        <div className="absolute z-20 inset-0 bg-primary bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <LoadingWheel />
        </div>
      )}
      <div className="absolute right-4 top-4 flex gap-2 z-10">
        <div data-tooltip="Edit the settings" onClick={handleEdit}>
          <div className="cursor-pointer svg-mask edit-icon w-7 h-7 bg-cardText right-0 hover:scale-125 transition-all" />
        </div>
      </div>
      <Input
        label="Gallery max photos"
        placeholder="e.g.: 10"
        type="number"
        id="galleryMaxPhotos"
        value={changedSettings.galleryMaxPhotos}
        readOnly={!isEditing}
        onChange={(e) => handleChange("galleryMaxPhotos", e.target.value)}
      />
      <Input
        label="Home max photos"
        placeholder="e.g.: 10"
        type="number"
        id="homeMaxPhotos"
        value={changedSettings.homeMaxPhotos}
        readOnly={!isEditing}
        onChange={(e) => handleChange("homeMaxPhotos", e.target.value)}
      />
      <div className="mb-4">
        <TagBox
          dataSource="/api/categories"
          onSelectionChange={handleMultiSelectChange}
          initialSelection={changedSettings.gallerySelectedCategories}
          readOnly={!isEditing}
          placeholder="Select categories"
        />
      </div>
      {isEditing && (
        <div className="items-center text-center w-full justify-end flex space-x-2">
          <Button
            buttonType="normal"
            type="button"
            onClick={handleCancel}
            text="Cancel"
          />
          <Button type="submit" disabled={!user} text="Save" />
        </div>
      )}
    </form>
  );
};

export default SettingsForm;
