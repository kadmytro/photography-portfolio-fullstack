import React, { useEffect, useState } from "react";
import { Terms as ITerms } from "@shared/types/Terms";
import api from "../services/api";
import LoadingWheel from "../components/LoadingWheel";

function TermsPage() {
  const [terms, setTerms] = useState<ITerms>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const response = await api.get("/api/settings/terms");
        setTerms(response.data);
      } catch (error) {
        setTerms({
          title: "Terms",
          text: "Something went wrong",
        });
        console.error("Failed to fetch about me part:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutMe();
  }, []);

  return (
    <div style={{ minHeight: "calc(100vh - 528px)" }}>
      <div className="min-h-300px py-24 bg-primary text-primaryText place-content-center">
        {loading && <LoadingWheel />}
        {!loading && (
          <h2 className="m-auto pb-4 text-4xl text-center font-title">
            {terms?.title}
          </h2>
        )}
        {!loading && (
          <div
            className="aboutMeContent text-lg mx-auto center text-justify whitespace-pre-line"
            style={{ width: "calc(50% + 150px)" }}
          >
            {terms?.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default TermsPage;
