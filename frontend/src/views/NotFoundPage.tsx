import React from "react";
import { HelmetProvider } from "react-helmet-async";

function NotFoundPage() {
  return (
    <div
      className="w-full py-10 text-center text-primaryText  contentMinHeight"
      style={{ minHeight: "calc(100vh - 528px)" }}
    >
      <HelmetProvider> <title>404 - Page Not Found</title> </HelmetProvider>
      <h1 className="text-4xl py-10">404 - Page Not Found</h1>
      <p className="text-2xl py-10">
        The page you are looking for does not exist.
      </p>
    </div>
  );
}

export default NotFoundPage;
