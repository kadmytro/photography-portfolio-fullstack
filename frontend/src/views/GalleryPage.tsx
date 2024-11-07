import { useEffect, useRef, useState } from "react";
import { Gallery } from "../components/Gallery";
import { Tab, TabView } from "../components/TabView";
import {
  getPhotosByCategoryId,
  getPhotoCategoriesToDisplay,
  getPhotoUrl,
} from "../services/galleryApi";
import LoadingWheel from "../components/LoadingWheel";

function GalleryPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const initialWidth = containerRef.current?.clientWidth || window.innerWidth;
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await getPhotoCategoriesToDisplay();

        if (!categories || !Array.isArray(categories)) return;

        const newTabs = await Promise.all(
          categories.map(async (category: any) => {
            const photos = (await getPhotosByCategoryId(category.id)) ?? [];
            const items = photos.map((photo: any) => ({
              image: getPhotoUrl(photo.id),
              description: photo.caption,
              height: photo.height,
              width: photo.width,
              id: photo.id,
            }));

            return {
              title: category.name,
              content: (
                <div key={category.id}>
                  <Gallery items={items} initialWidth={initialWidth} />
                </div>
              ),
            };
          })
        );

        setTabs(newTabs);
      } catch (error) {
        console.error("Error fetching data for tabs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialWidth]);

  return (
    <div className="Content" style={{ minHeight: "calc(100vh - 224px)" }}>
      {(!loading && <TabView tabs={tabs} hasBanner={false}></TabView>) || (
        <LoadingWheel style={{ height: "calc(100vh - 224px)" }} />
      )}
    </div>
  );
}

export default GalleryPage;
