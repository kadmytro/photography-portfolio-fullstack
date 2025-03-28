import { useEffect, useRef, useState } from "react";
import { Gallery } from "../components/Gallery";
import AboutMe from "../components/AboutMe";
import Contacts from "../components/Contacts";
import { getPhotoUrl, getRecentPhotos } from "../services/galleryApi";
import LoadingWheel from "../components/LoadingWheel";
import { Helmet } from "react-helmet-async";

function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const initialWidth = containerRef.current?.clientWidth || window.innerWidth;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const photos = await getRecentPhotos();

        if (!photos || !Array.isArray(photos)) return;

        const items = photos.map((photo: any) => ({
          image: getPhotoUrl(photo.id),
          description: photo.caption,
          height: photo.height,
          width: photo.width,
          id: photo.id,
        }));

        setItems(items);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching data for tabs", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialWidth]);
  return (
    <div
      className="Content relative text-primaryText"
      style={{ minHeight: "calc(100vh - 224px)" }}
    >
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="m-auto font-normal text-4xl tracking-wider my-8 w-fit font-title">
        Latest works
      </div>
      {(!loading && (
        <Gallery items={items} initialWidth={initialWidth}></Gallery>
      )) || <LoadingWheel style={{ height: "calc(100vh - 224px)" }} />}
      <AboutMe></AboutMe>
      <Contacts></Contacts>
    </div>
  );
}

export default HomePage;
