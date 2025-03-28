import { useEffect, useState } from "react";
import { Terms as ITerms } from "@shared/types/Terms";
import api from "../services/api";
import LoadingWheel from "../components/LoadingWheel";
import { Helmet } from "react-helmet-async";

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
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch about me part:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAboutMe();
  }, []);

  return (
    <div
      className="content-center justify-center align-middle"
      style={{ minHeight: "calc(100vh - 224px)" }}
    >
      <Helmet>
        <title>Terms & Conditions</title>
      </Helmet>
      <div className="h-full py-24 bg-primary text-primaryText">
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
