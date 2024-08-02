import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import { AboutMe } from "../../../shared/types/AboutMe";
import LoadingWheel from "../components/LoadingWheel";

const AboutMeForm: React.FC = () => {
  const [aboutMe, setAboutMe] = useState<AboutMe>({ title: "", text: "" });
  const [changedAboutMe, setChangedAboutMe] = useState<Partial<AboutMe>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const response = await api.get("/api/details/aboutMe");
        setAboutMe(response.data);
      } catch (error) {
        console.error("Failed to fetch aboutMe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutMe();
  }, []);

  const handleChange = (field: keyof AboutMe, value: string) => {
    setAboutMe((prevAboutMe) => ({
      ...prevAboutMe,
      [field]: value,
    }));

    setChangedAboutMe((prevChangedAboutMe) => ({
      ...prevChangedAboutMe,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put("/api/admin/aboutMe/put", changedAboutMe, {
        withCredentials: true,
      });
      alert("About me updated successfully!");
      setChangedAboutMe({});
    } catch (error) {
      console.error("Failed to update about me:", error);
      alert("Failed to update about me");
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
      <div key="title" className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
          Title
        </label>
        <input
          type="text"
          value={aboutMe.title}
          onChange={(e) =>
            handleChange("title" as keyof AboutMe, e.target.value)
          }
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
        />
      </div>
      <div key="text" className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
          About me text
        </label>
        <textarea
          value={aboutMe.text}
          onChange={(e) =>
            handleChange("text" as keyof AboutMe, e.target.value)
          }
          className="w-full min-h-200px px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
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
        Update About Me
      </button>
    </form>
  );
};

export default AboutMeForm;
