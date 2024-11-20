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
import { Popup } from "../base_components/Popup";
import TermsForm from "../admin_components/TermsForm";
import { Helmet } from "react-helmet";

function AdminPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialWidth = containerRef.current?.clientWidth || window.innerWidth;
  const [selectedCategories, setSelectedCategories] = useState<
    (number | string)[]
  >([]);
  const [popupOpened, setPopupOpened] = useState(false);
  const [popupContent, setPopupContent] = useState<React.ReactNode>(null);
  const [popupTitle, setPopupTitle] = useState<string | undefined>();
  const onPopupClose = () => {
    setPopupContent(null);
    setPopupTitle(undefined);
    setPopupOpened(false);
  };

  const onPopupOpen = (content: React.ReactNode, title?: string) => {
    setPopupContent(content);
    setPopupTitle(title);
    setPopupOpened(true);
  };

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
          onSelectionChanged: () => {
            setSelectedCategories([]);
          },
          content: (
            <>
              <div className="flex flex-col narrow:flex-row mx-4 narrow:mx-10">
                <div className="pr-2 narrow:px-5 w-full narrow:w-fit narrow:text-center self-center">
                  Categories:
                </div>
                <TagBox
                  dataSource="/api/categories"
                  initialSelection={selectedCategories}
                  placeholder="Select categories"
                  onSelectionChange={(categories) =>
                    setSelectedCategories(categories)
                  }
                  className="wide:w-fit"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <Pager
                  contentComponent={(props) => (
                    <Gallery
                      {...props}
                      initialWidth={initialWidth}
                      admin={true}
                      openPopupCallback={onPopupOpen}
                      closePopupCallback={onPopupClose}
                    />
                  )}
                  mapDataToItems={mapDataToGalleryItems}
                  endpoint={getEndPoint()}
                  itemsPerPage={10}
                />
              </div>
            </>
          ),
        },
        {
          id: 13,
          title: "Manage Categories",
          content: (
            <CategoryList
              openPopupCallback={onPopupOpen}
              closePopupCallback={onPopupClose}
            />
          ),
        },
      ],
    },
    {
      title: "Products Management",
      items: [
        {
          id: 21,
          title: "Manage Services",
          content: (
            <ServiceList
              openPopupCallback={onPopupOpen}
              closePopupCallback={onPopupClose}
            />
          ),
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
          content: (
            <Messages
              messagesType="regular"
              openPopupCallback={onPopupOpen}
              closePopupCallback={onPopupClose}
            />
          ),
        },
        {
          id: 32,
          title: "Archived Messages",
          stickyTitle: true,
          content: (
            <Messages
              messagesType="archived"
              openPopupCallback={onPopupOpen}
              closePopupCallback={onPopupClose}
            />
          ),
        },
        {
          id: 33,
          title: "Trash",
          stickyTitle: true,
          content: (
            <Messages
              messagesType="deleted"
              openPopupCallback={onPopupOpen}
              closePopupCallback={onPopupClose}
            />
          ),
        },
      ],
    },
    {
      title: "Website Management",
      items: [
        {
          id: 41,
          title: "Contacts",
          content: (
            <ContactsForm
              openPopupCallback={onPopupOpen}
              closePopupCallback={onPopupClose}
            />
          ),
        },
        {
          id: 42,
          title: "Links",
          content: (
            <LinksForm
              openPopupCallback={onPopupOpen}
              closePopupCallback={onPopupClose}
            />
          ),
        },
        {
          id: 43,
          title: "AboutMe",
          content: (
            <AboutMeForm
              openPopupCallback={onPopupOpen}
              closePopupCallback={onPopupClose}
            />
          ),
        },
        {
          id: 44,
          title: "Settings",
          content: (
            <SettingsForm
              openPopupCallback={onPopupOpen}
              closePopupCallback={onPopupClose}
            />
          ),
        },
        {
          id: 45,
          title: "Terms",
          content: (
            <TermsForm
              openPopupCallback={onPopupOpen}
              closePopupCallback={onPopupClose}
            />
          ),
        },
        {
          id: 46,
          title: "Account",
          content: (
            <ChangePasswordForm
              openPopupCallback={onPopupOpen}
              closePopupCallback={onPopupClose}
            />
          ),
        },
      ],
    },
  ];

  return (
    <div
      className="Content relative text-primaryText w-full"
      style={{ minHeight: "calc(100vh - 224px)" }}
    >
      <Helmet> <title>Admin page</title> </Helmet>
      <HorizontalDrawer groups={groups} />
      <Popup
        key="adminPopup"
        isOpen={popupOpened}
        title={popupTitle}
        onClose={onPopupClose}
        className="w-fit"
      >
        {popupContent}
      </Popup>
    </div>
  );
}

export default AdminPage;
