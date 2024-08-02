import { useCallback, useEffect, useRef, useState } from "react";
import { Gallery } from "../components/Gallery";
import { getPhotoUrl } from "../services/galleryApi";
import PhotoUploadForm from "../admin_components/PhotoUploadForm";
import ContactsForm from "../admin_components/ContactsForm";
import LinksForm from "../admin_components/LinksForm";
import AboutMeForm from "../admin_components/AboutMeForm";
import HorizontalDrawer from "../components/HorizontalDrawer";
import { PhotoCardProps } from "../components/PhotoCard";
import Pager from "../components/Pager";
import CategoryList from "../admin_components/CategoryList";
import MultiSelectDropdown from "../admin_components/Category";
import SettingsForm from "../admin_components/SettingsForm";

function AdminPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const initialWidth = containerRef.current?.clientWidth || window.innerWidth;
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const getEndPoint = () => {
    let result = "/api/photos/all";

    if (selectedCategories.length > 0) {
      result = `/api/photos/byCategories/${selectedCategories.join(",")}`;
    }

    return result;
  };

  const mapDataToGalleryItems = (data: any): PhotoCardProps[] => {
    return Object.values(data).map((photo: any) => ({
      id: photo.id,
      image: getPhotoUrl(photo.id),
      description: photo.caption,
      location: photo.location,
      categoriesIds: photo.categoriesIds,
      height: photo.height,
      width: photo.width,
    }));
  };

  const groups = [
    {
      title: "Content Management",
      items: [
        { id: 1, title: "Add new photo", content: <PhotoUploadForm /> },
        {
          id: 2,
          title: "Manage photos",
          content: (
            <>
              <div className="flex mx-10">
                <div className="px-5 text-center self-center">Categories:</div>
                <MultiSelectDropdown
                  onSelectionChange={(categories) =>
                    setSelectedCategories(categories)
                  }
                  initialSelection={selectedCategories}
                />
              </div>
              <Pager
                contentComponent={(props) => (
                  <Gallery
                    {...props}
                    initialWidth={initialWidth}
                    admin={true}
                  />
                )}
                mapDataToItems={mapDataToGalleryItems}
                endpoint={getEndPoint()}
                itemsPerPage={10}
              />
            </>
          ),
        },
        {
          id: 3,
          title: "Manage Categories",
          content: <CategoryList />,
        },
      ],
    },
    {
      title: "Website Management",
      items: [
        { id: 21, title: "Contacts", content: <ContactsForm /> },
        { id: 22, title: "Links", content: <LinksForm /> },
        { id: 23, title: "AboutMe", content: <AboutMeForm /> },
        {
          id: 24,
          title: "Settings",
          content: (
            <SettingsForm/>
          ),
        },
      ],
    },
  ];

  return (
    <div className="Content relative text-primaryText min-h-screen">
      <HorizontalDrawer groups={groups} />
    </div>
  );
}

export default AdminPage;
