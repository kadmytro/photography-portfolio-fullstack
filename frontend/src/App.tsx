import { useRef } from "react";
import { Navbar, NavbarProps } from "./components/Navbar";
import { Gallery } from "./components/Gallery";
import Footer, { FooterProps } from "./components/Footer";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./views/HomePage";
import GalleryPage from "./views/GalleryPage";
import NotFoundPage from "./views/NotFoundPage";

const data = [
  [
    {
      src: "https://img.freepik.com/free-photo/digital-painting-mountain-with-colorful-tree-foreground_1340-25699.jpg?t=st=1689788907~exp=1689792507~hmac=7a7dada6fa64be3ccb98164ffe4a96b3bbb0eeae95b3ebbb1c1fb8d91e837e2d&w=1800",
      alt: "Image 1",
      description: "Description 1",
    },
    {
      src: "https://img.freepik.com/free-photo/lone-tree_181624-46361.jpg?w=1800&t=st=1689789913~exp=1689790513~hmac=311c5f5260d8773f7cefbaec620bb733ab61bd9b1da8fc4b8f0787c006e7e8c5",
      alt: "Image 2",
      description: "Description 2",
    },
    {
      src: "https://img.freepik.com/premium-photo/mountain-lake-with-blue-sky-clouds-reflected-still-water-lake_938627-5.jpg?w=1380",
      alt: "Image 3",
      description: "Description 3",
    },
  ],

  [
    {
      src: "https://img.freepik.com/free-photo/aesthetic-planet-ocean-background-galaxy-nature-remix_53876-129796.jpg?w=1800&t=st=1689790429~exp=1689791029~hmac=1db8a6b70cd8912e4ce3ce765eb1b910dd07d1f1d4d7d4b89e5562074e5d6e6f",
      alt: "Image 1",
      description: "Description 1",
    },
    {
      src: "https://img.freepik.com/free-photo/misty-julian-alps-peak-round-badge_53876-153331.jpg?w=826&t=st=1689790988~exp=1689791588~hmac=faf8459a62d720cf882f26f5da69f9ad1302e4069390517eeb26c0befdbf99fe",
      alt: "Image 2",
      description: "Description 2",
    },
    {
      src: "https://img.freepik.com/free-photo/beautiful-mountain-lake-nature-background-with-dark-planet-galaxy-remix_53876-126762.jpg?w=1800&t=st=1689791013~exp=1689791613~hmac=7e5cc3a93b518974e1c66422f23be145afe6728d805484483bca43d42292ecd0",
      alt: "Image 3",
      description: "Description 3",
    },
  ],

  [
    {
      src: "https://img.freepik.com/free-photo/vibrant-abstract-colored-fall-leaves_23-2148239684.jpg?w=1800&t=st=1689790592~exp=1689791192~hmac=0d34875e101dbe33b25b3895c4cedaa9b7e4fa9620e239fac504b3f841f81fa4",
      alt: "Image 1",
      description: "Description 1",
    },
    {
      src: "https://img.freepik.com/free-photo/wet-monstera-deliciosa-plant-leaves-garden_53876-139812.jpg?w=1800&t=st=1689790611~exp=1689791211~hmac=569440357b2686cf21cee519ab5a13faeabbd91200de32530a5b8df262c4224a",
      alt: "Image 2",
      description: "Description 2",
    },
    {
      src: "https://img.freepik.com/free-photo/vivid-colored-transparent-autumn-leaf_23-2148239739.jpg?w=826&t=st=1689790627~exp=1689791227~hmac=9f29d0fb5cc054783a446f576d17c192bab109c3387734f6fd1f3273a478017c",
      alt: "Image 3",
      description: "Description 3",
    },
  ],
];

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
  const footerLinks: FooterProps = {
    telegramLink: "",
    instagramLink: "https://www.instagram.com/kadmy.photo/",
    linkedInLink: "https://www.linkedin.com/in/dmytro-karapostol-a11881244/",
    youTubeLink: "",
  };
  return (
    <div className="App min-h-screen">
      <Router>
        <Navbar {...navbarProps} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer {...footerLinks}></Footer>
        <ScrollToTopButton />
      </Router>
    </div>
  );
}

export default App;
