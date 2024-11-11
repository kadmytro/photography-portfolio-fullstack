import { Navbar, NavbarProps } from "./components/Navbar";
import Footer from "./components/Footer";
import { ScrollUpButton } from "./components/ScrollUpButton";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./views/HomePage";
import GalleryPage from "./views/GalleryPage";
import LoginPage from "./views/LoginPage";
import NotFoundPage from "./views/NotFoundPage";
import AdminPage from "./views/AdminPage";
import PrivateRoute from "./views/PrivateRoute";
import { AuthProvider } from "./context/AuthContextType";
import PricesPage from "./views/PricesPage";
import TermsPage from "./views/TermsPage";

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
    <div className="App min-h-screen w-full bg-primary">
      <Router>
        <AuthProvider>
          <Navbar {...navbarProps} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<LoginPage />} />
            <Route
              path="/admin"
              element={<PrivateRoute element={<AdminPage />} />}
            />
            <Route path="reset-password/:resetToken" element={<LoginPage />} />
            <Route path="prices" element={<PricesPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
        <Footer></Footer>
        <ScrollUpButton />
      </Router>
    </div>
  );
}

export default App;
