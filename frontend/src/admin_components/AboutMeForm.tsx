import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import { AboutMe } from "../../../shared/types/AboutMe";
import LoadingWheel from "../components/LoadingWheel";
import Input from "../base_components/Input";
import TextArea from "../base_components/TextArea";
import Button from "../base_components/Button";

interface AboutMeFormProps {
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
}

const AboutMeForm: React.FC<AboutMeFormProps> = ({
  openPopupCallback,
  closePopupCallback,
}) => {
  const [aboutMe, setAboutMe] = useState<AboutMe>({ title: "", text: "" });
  const [changedAboutMe, setChangedAboutMe] = useState<AboutMe>({
    title: "",
    text: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const response = await api.get("/api/settings/aboutMe");
        setAboutMe(response.data);
        setChangedAboutMe(response.data);
      } catch (error) {
        const defaultObj = {
          title: "About me",
          text: "",
        };
        setAboutMe(defaultObj);
        setChangedAboutMe(defaultObj);
        setError("No about me found in the database");
        console.error("Failed to fetch aboutMe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutMe();
  }, []);

  useEffect(() => {
    setError(null);
  }, [isEditing]);

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

  const handleChange = (field: keyof AboutMe, value: string) => {
    setChangedAboutMe((prevChangedAboutMe) => ({
      ...prevChangedAboutMe,
      [field]: value,
    }));
    setError(null);
  };

  const handleEdit = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setChangedAboutMe(aboutMe);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    try {
      await api.put("/api/admin/aboutMe/put", changedAboutMe, {
        withCredentials: true,
      });
      setAboutMe(changedAboutMe);
    } catch (error) {
      console.error("Failed to update about me:", error);
      setError("Failed to update about me");
      if (openPopupCallback) {
        openPopupCallback(
          getPopupContent("Failed to update about me!", "error", "red"),
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
      className="min-w-200px w-full max-w-500px mx-auto px-4 py-6 bg-card text-cardText relative rounded shadow"
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
        <div onClick={handleEdit} data-tooltip="Edit the About me">
          <div className="svg-mask edit-icon w-7 h-7 bg-cardText right-0 cursor-pointer hover:scale-125 transition-all" />
        </div>
      </div>
      <Input
        label="Block title"
        placeholder="e.g.: About me"
        value={changedAboutMe.title}
        inputClassName="mobile:w-full"
        readOnly={!isEditing}
        onChange={(e) => handleChange("title" as keyof AboutMe, e.target.value)}
      />
      <TextArea
        label="About me text"
        placeholder="e.g..: Hello, I'm @kadmytro, I'm a professional photographer..."
        value={changedAboutMe.text}
        readOnly={!isEditing}
        onChange={(e) => handleChange("text" as keyof AboutMe, e.target.value)}
        className="min-h-200px mobile:w-full"
      />
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

export default AboutMeForm;
