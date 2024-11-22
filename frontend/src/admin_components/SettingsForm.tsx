import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import { Settings } from "@shared/types/Settings";
import LoadingWheel from "../components/LoadingWheel";
import Input from "../base_components/Input";
import Button from "../base_components/Button";
import TagBox from "../base_components/TagBox";

interface SettingsFormProps {
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
}

const emptySettings: Settings = {
  homeMaxPhotos: 0,
  galleryMaxPhotos: 0,
  gallerySelectedCategories: [],
};

const SettingsForm: React.FC<SettingsFormProps> = ({
  openPopupCallback,
  closePopupCallback,
}) => {
  const [settings, setSettings] = useState<Settings>(emptySettings);
  const [changedSettings, setChangedSettings] =
    useState<Settings>(emptySettings);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getPopupContent = (
    message: string,
    icon: string,
    iconColor: string
  ): React.ReactNode => {
    return (
      <div className="px-4 pb-4 pt-12 min-h-200px min-w-400px max-w-lg text-center border-t-1 border-primaryText border-opacity-30 relative content-center">
        <div
          className={
            "svg-mask h-20 w-20 bg-opacity-70 mx-auto absolute top-3 left-1/2 -translate-x-1/2 " +
            ` ${icon}-icon bg-${iconColor}-500`
          }
        ></div>
        <p className="max-w-md">{message}</p>
        <div className="w-80 absolute right-1/2 translate-x-1/2 bottom-2 flex gap-4 justify-around">
          <Button
            buttonType="default"
            text="Ok"
            className="w-1/2 left-1/2 -translate-x-/2"
            onClick={closePopupCallback}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/api/settings/gallerySettings");
        setSettings(response.data);
        setChangedSettings(response.data);
      } catch (error) {
        setSettings(emptySettings);
        setChangedSettings(emptySettings);
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch settings:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    setError(null);
  }, [isEditing]);

  const handleChange = (field: keyof Settings, value: string) => {
    const parsedValue =
      field === "homeMaxPhotos" || field === "galleryMaxPhotos"
        ? Number(value)
        : value;

    setChangedSettings((prevSettings) => ({
      ...prevSettings,
      [field]: parsedValue,
    }));

    setError(null);
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
      !changedSettings.homeMaxPhotos ||
      !changedSettings.galleryMaxPhotos ||
      !changedSettings.gallerySelectedCategories?.length
    ) {
      setError("All fields must be filled out.");
      setSaving(false);
      return;
    }
    setError(null);

    try {
      await api.put("/api/admin/gallerySettings/put", changedSettings, {
        withCredentials: true,
      });
      setSettings(changedSettings);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to update settings:", error);
      }
      if (openPopupCallback) {
        openPopupCallback(
          getPopupContent("Failed to update settings!", "error", "red"),
          "Something went wrong"
        );
      }
    } finally {
      setIsEditing(false);
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingWheel className="flex-1" />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-w-200px w-full max-w-500px mx-auto p-4 bg-card text-cardText relative rounded shadow"
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
        inputClassName="mobile:w-full"
      />
      <Input
        label="Home max photos"
        placeholder="e.g.: 10"
        type="number"
        id="homeMaxPhotos"
        value={changedSettings.homeMaxPhotos}
        readOnly={!isEditing}
        onChange={(e) => handleChange("homeMaxPhotos", e.target.value)}
        inputClassName="mobile:w-full"
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
