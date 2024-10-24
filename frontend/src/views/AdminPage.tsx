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
import SettingsForm from "../admin_components/SettingsForm";
import ServiceList from "../admin_components/ServiceList";
import TagBox from "../base_components/TagBox";
import { Messages } from "../admin_components/Messages";
import ChangePasswordForm from "../admin_components/ChangePasswordForm";

function AdminPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const initialWidth = containerRef.current?.clientWidth || window.innerWidth;
  const [selectedCategories, setSelectedCategories] = useState<
    (number | string)[]
  >([]);

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
      caption: photo.caption,
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
        { id: 11, title: "Add new photo", content: <PhotoUploadForm /> },
        {
          id: 12,
          title: "Manage photos",
          content: (
            <>
              <div className="flex mx-10">
                <div className="px-5 text-center self-center">Categories:</div>
                <TagBox
                  dataSource="/api/categories"
                  initialSelection={selectedCategories}
                  placeholder="Select categories"
                  onSelectionChange={(categories) =>
                    setSelectedCategories(categories)
                  }
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
          id: 13,
          title: "Manage Categories",
          content: <CategoryList />,
        },
      ],
    },
    {
      title: "Products Management",
      items: [
        {
          id: 21,
          title: "Manage Services",
          content: <ServiceList />,
        },
      ],
    },
    {
      title: "Messages Management",
      items: [
        {
          id: 31,
          title: "Regular Messages",
          stickyTitle: true,
          content: <Messages messagesType="regular" />,
        },
        {
          id: 32,
          title: "Archived Messages",
          stickyTitle: true,
          content: <Messages messagesType="archived" />,
        },
        {
          id: 33,
          title: "Trash",
          stickyTitle: true,
          content: <Messages messagesType="deleted" />,
        },
      ],
    },
    {
      title: "Website Management",
      items: [
        { id: 41, title: "Contacts", content: <ContactsForm /> },
        { id: 42, title: "Links", content: <LinksForm /> },
        { id: 43, title: "AboutMe", content: <AboutMeForm /> },
        {
          id: 44,
          title: "Settings",
          content: <SettingsForm />,
        },
        { id: 45, title: "Account", content: <ChangePasswordForm /> },
      ],
    },
  ];

  return (
    <div className="Content relative text-primaryText w-full contentMinHeight">
      <HorizontalDrawer groups={groups} />
    </div>
  );
}

export default AdminPage;
