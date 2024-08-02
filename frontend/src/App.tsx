import { useRef } from "react";
import { Navbar, NavbarProps } from "./components/Navbar";
import Footer from "./components/Footer";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./views/HomePage";
import GalleryPage from "./views/GalleryPage";
import LoginPage from "./views/LoginPage";
import NotFoundPage from "./views/NotFoundPage";
import AdminPage from "./views/AdminPage";
import PrivateRoute from "./views/PrivateRoute";
import { AuthProvider } from "./context/AuthContextType";

const navbarProps: NavbarProps = {
  homeText: "Home",
  homeUrl: "/home",
  galleryText: "Gallery",
  galleryUrl: "/gallery",
  pricesText: "Prices",
  pricesUrl: "/prices",
  contactsText: "Contacts",
};  
function App() {
  return (
    <div className="App min-h-screen">
      <Router>
        <AuthProvider>
          <Navbar {...navbarProps} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/admin" element={<PrivateRoute element={<AdminPage />} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
        <Footer></Footer>
        <ScrollToTopButton />
      </Router>
    </div>
  );
}

export default App;
