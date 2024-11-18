import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import { Links } from "../../../shared/types/Links";
import LoadingWheel from "../components/LoadingWheel";
import Input from "../base_components/Input";
import Button from "../base_components/Button";

interface LinksFormProps {
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
}

const emptyLinks = {
  telegramLink: "",
  instagramLink: "",
  linkedInLink: "",
  youTubeLink: "",
};

const LinksForm: React.FC<LinksFormProps> = ({
  openPopupCallback,
  closePopupCallback,
}) => {
  const [links, setLinks] = useState<Links>(emptyLinks);
  const [changedLinks, setChangedLinks] = useState<Links>(emptyLinks);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await api.get("/api/settings/links");
        setLinks(response.data);
        setChangedLinks(response.data);
      } catch (error) {
        setLinks(emptyLinks);
        setChangedLinks(emptyLinks);
        setError(`Failed to fetch links. ${error}`);
        console.error("Failed to fetch links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
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

  const handleChange = (field: keyof Links, value: string) => {
    setChangedLinks((prevChangedLinks) => ({
      ...prevChangedLinks,
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
      if (openPopupCallback) {
        openPopupCallback(
          getPopupContent("Failed to update links!", "error", "red"),
          "Something went wrong"
        );
      }
      setError("Failed to update contacts");
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
        <div data-tooltip="Edit the links" onClick={handleEdit}>
          <div className="cursor-pointer svg-mask edit-icon w-7 h-7 bg-cardText right-0 hover:scale-125 transition-all" />
        </div>
      </div>
      {Object.keys(links).map((key) => (
        <Input
          key={key}
          label={key.replace("Link", " Link")}
          id={key}
          value={(changedLinks as any)[key]}
          readOnly={!isEditing}
          onChange={(e) => handleChange(key as keyof Links, e.target.value)}
          className="mobile:w-full"
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
