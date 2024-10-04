import React, { useEffect, useState } from "react";
import { PhotoCard, PhotoCardProps } from "../components/PhotoCard";
import api from "../services/api";
import PhotoEditForm from "./PhotoEditForm";

interface ExtendedPhotoCardProps extends PhotoCardProps {
  refreshData?: () => void;
}

const ExtendedPhotoCard: React.FC<ExtendedPhotoCardProps> = (props) => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [photoDetails, setPhotoDetails] = useState(props);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setPhotoDetails((prevProps) => {
      return {
        ...prevProps,
        imageLoadedCallback: () => {
          setImageLoaded(true);
        },
      };
    });
  }, [props]);

  const handleEditClick = () => {
    setShowEditPopup(true);
  };

  useEffect(() => {
    if (showEditPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showEditPopup]);

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this photo?"
    );
    if (confirmDelete) {
      try {
        await api.delete(`/api/photos/${props.id}`);
        alert("Photo deleted successfully");
        if (props.refreshData) {
          props.refreshData();
        }
      } catch (error) {
        console.error("Failed to delete photo:", error);
        alert("Failed to delete photo");
      }
    }
  };

  const closePopup = () => {
    setShowEditPopup(false);
  };

  const handlePhotoUpdate = async (
    updatedPhoto: Partial<Omit<PhotoCardProps, "id">>
  ) => {
    try {
      await api.put(`/api/photos/${props.id}`, updatedPhoto);
      setPhotoDetails((prevDetails) => ({
        ...prevDetails,
        ...updatedPhoto,
      }));
      setShowEditPopup(false);
      if (props.refreshData) {
        props.refreshData();
      }
    } catch (error) {
      console.error("Failed to update the photo:", error);
      alert("Failed to update the photo");
    }
  };

  return (
    <div className="relative h-fit">
      <PhotoCard {...photoDetails} />
      {imageLoaded && (
        <div className="absolute top-1 right-1 flex gap-2 bg-primary bg-opacity-30 p-3 hover:bg-opacity-50 rounded-xl">
          <div data-tooltip="Edit the photo" onClick={handleEditClick}>
            <div className="svg-mask edit-icon w-7 h-7 bg-cardText right-0 cursor-pointer hover:scale-125 transition-all" />
          </div>
          <div data-tooltip="Delete the photo" onClick={handleDeleteClick}>
            <div className="svg-mask delete-icon w-7 h-7 bg-red-700 right-6 top-0 cursor-pointer hover:scale-125 transition-all" />
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="fixed inset-0 w-screen h-screen overflow-auto flex items-center justify-center backdrop-blur bg-primary bg-opacity-30 z-50">
          <div className="rounded shadow-lg">
            <PhotoEditForm
              photo={photoDetails}
              onUpdate={handlePhotoUpdate}
              onClose={closePopup}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtendedPhotoCard;
