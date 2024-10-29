import React, { useEffect, useState } from "react";
import { PhotoCard, PhotoCardProps } from "../components/PhotoCard";
import api from "../services/api";
import PhotoEditForm from "./PhotoEditForm";
import Button from "../base_components/Button";

interface ExtendedPhotoCardProps extends PhotoCardProps {
  refreshData?: (keepPage?: boolean) => void;
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
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

  const getPopupContent = (
    message: string,
    onConfirmCallback: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onCancelCallback: React.MouseEventHandler<HTMLButtonElement> | undefined
  ): React.ReactNode => {
    return (
      <div className="px-4 pb-12 pt-4 min-h-200px min-w-400px max-w-lg text-center border-t-1 border-primaryText border-opacity-30 relative content-center">
        <p className="max-w-md">{message}</p>
        <div className="w-80 absolute right-1/2 translate-x-1/2 bottom-2 flex gap-4 justify-around">
          <Button
            buttonType="default"
            text="Yes"
            className="flex-1"
            onClick={onConfirmCallback}
          />
          <Button
            buttonType="danger"
            text="No"
            className="flex-1"
            onClick={onCancelCallback}
          />
        </div>
      </div>
    );
  };

  const handleDeleteClick = async () => {
    const deleteCallback = async () => {
      try {
        await api.delete(`/api/photos/${props.id}`);
        if (props.refreshData) {
          props.refreshData(true);
        }

        if (props.closePopupCallback) {
          props.closePopupCallback();
        }
      } catch (error) {
        console.error("Failed to delete photo:", error);
      } finally {
        if (props.closePopupCallback) {
          props.closePopupCallback();
        }
      }
    };

    const popupContent = getPopupContent(
      "Are you sure you want to delete this photo?",
      deleteCallback,
      props.closePopupCallback
    );

    if (props.openPopupCallback) {
      props.openPopupCallback(popupContent, "Please confirm the action");
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
        props.refreshData(true);
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
