import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import { Links } from "../../../shared/types/Links";
import LoadingWheel from "../components/LoadingWheel";
import Input from "../base_components/Input";
import Button from "../base_components/Button";

const LinksForm: React.FC = () => {
  const [links, setLinks] = useState<Links>({});
  const [changedLinks, setChangedLinks] = useState<Links>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await api.get("/api/details/links");
        setLinks(response.data);
        setChangedLinks(response.data);
      } catch (error) {
        console.error("Failed to fetch links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleChange = (field: keyof Links, value: string) => {
    setChangedLinks((prevChangedLinks) => ({
      ...prevChangedLinks,
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
    setChangedLinks(links);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/admin/links/put", changedLinks, {
        withCredentials: true,
      });
      setLinks(changedLinks);
    } catch (error) {
      console.error("Failed to update links:", error);
      alert("Failed to update links");
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
      {Object.keys(links).map((key) => (
        <Input
          key={key}
          label={key.replace("Link", " Link")}
          id={key}
          value={(changedLinks as any)[key]}
          readOnly={!isEditing}
          onChange={(e) => handleChange(key as keyof Links, e.target.value)}
        />
      ))}
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

export default LinksForm;
