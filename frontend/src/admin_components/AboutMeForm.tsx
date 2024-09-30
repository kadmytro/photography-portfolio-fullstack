import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import { AboutMe } from "../../../shared/types/AboutMe";
import LoadingWheel from "../components/LoadingWheel";
import Input from "../base_components/Input";
import TextArea from "../base_components/TextArea";
import Button from "../base_components/Button";

const AboutMeForm: React.FC = () => {
  const [aboutMe, setAboutMe] = useState<AboutMe>({ title: "", text: "" });
  const [changedAboutMe, setChangedAboutMe] = useState<AboutMe>({
    title: "",
    text: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const response = await api.get("/api/details/aboutMe");
        setAboutMe(response.data);
        setChangedAboutMe(response.data);
      } catch (error) {
        console.error("Failed to fetch aboutMe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutMe();
  }, []);

  const handleChange = (field: keyof AboutMe, value: string) => {
    setChangedAboutMe((prevChangedAboutMe) => ({
      ...prevChangedAboutMe,
      [field]: value,
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
      alert("Failed to update about me");
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
      className="max-w-xl mx-auto px-4 py-6 bg-card text-cardText relative rounded shadow"
    >
      {saving && (
        <div className="absolute z-20 inset-0 bg-primary bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <LoadingWheel />
        </div>
      )}
      <div className="absolute right-4 top-4 flex gap-2 z-10">
        <div
          className="cursor-pointer svg-mask edit-icon w-7 h-7 bg-cardText right-0 hover:scale-125 transition-all"
          onClick={handleEdit}
        ></div>
      </div>
      <Input
        label="Block title"
        placeholder="e.g.: About me"
        value={changedAboutMe.title}
        readOnly={!isEditing}
        onChange={(e) => handleChange("title" as keyof AboutMe, e.target.value)}
      />
      <TextArea
        label="About me text"
        placeholder="e.g..: Hello, I'm @kadmytro, I'm a professional photographer..."
        value={changedAboutMe.text}
        readOnly={!isEditing}
        onChange={(e) => handleChange("text" as keyof AboutMe, e.target.value)}
        className="min-h-200px"
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
