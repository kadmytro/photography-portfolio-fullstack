import React, { useEffect, useState } from "react";
import { AboutMe as IAboutMe } from "@shared/types/AboutMe";
import api from "../services/api";
import LoadingWheel from "./LoadingWheel";

function AboutMe() {
  const [aboutMe, setAboutMe] = useState<IAboutMe>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const response = await api.get("/api/settings/aboutMe");
        setAboutMe(response.data);
      } catch (error) {
        setAboutMe({
          title: "About me",
          text: 'Here must be the "About me part". Something went wrong',
        });
        console.error("Failed to fetch about me part:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutMe();
  }, []);
  return (
    <div className="aboutMeContainer min-h-300px py-24 bg-secondary text-secondaryText place-content-center">
      {loading && <LoadingWheel />}
      {!loading && (
        <h2 className="m-auto pb-4 text-4xl text-center font-title">
          {aboutMe?.title}
        </h2>
      )}
      {!loading && (
        <div
          className="aboutMeContent text-lg mx-auto center text-justify"
          style={{ width: "calc(50% + 150px)" }}
        >
          {aboutMe?.text}
        </div>
      )}
    </div>
  );
}

export default AboutMe;
