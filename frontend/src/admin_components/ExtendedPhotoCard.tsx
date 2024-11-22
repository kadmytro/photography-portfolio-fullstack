import React, { useEffect, useState } from "react";
import { PhotoCard, PhotoCardProps } from "../components/PhotoCard";
import api from "../services/api";
import PhotoEditForm from "./PhotoEditForm";
import Button from "../base_components/Button";
import { usePopup } from "../context/PopupContext";

interface ExtendedPhotoCardProps extends PhotoCardProps {
  refreshData?: (keepPage?: boolean) => void;
}

const ExtendedPhotoCard: React.FC<ExtendedPhotoCardProps> = (props) => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [photoDetails, setPhotoDetails] = useState(props);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { openPopup, closePopup } = usePopup();
  const [cacheInvalidationKey, setCacheInvalidationKey] = useState(
    new Date().getTime()
  );

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

  const handleEditClick = (cacheInvalidationKey?: number) => {
    openPopup(
      <PhotoEditForm
        photo={{
          ...photoDetails,
          cacheInvalidationKey: cacheInvalidationKey,
        }}
        onUpdate={handlePhotoUpdate}
        onClose={closePopup}
      />,
      "Edit photo"
    );
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
      <div className="px-4 pb-12 pt-4 min-h-200px narrow:min-w-400px max-w-lg text-center border-t-1 border-primaryText border-opacity-30 relative content-center">
        <p className="max-w-md">{message}</p>
        <div className="narrow:w-80 w-4/5 absolute right-1/2 translate-x-1/2 bottom-2 flex gap-4 justify-around">
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

  const getAlertContent = (
    message: string,
    icon: string,
    iconColor: string
  ): React.ReactNode => {
    return (
      <div className="px-4 pb-4 pt-12 min-h-200px narrow:min-w-400px max-w-lg text-center border-t-1 border-primaryText border-opacity-30 relative content-center">
        <div
          className={
            "svg-mask h-20 w-20 bg-opacity-70 mx-auto absolute top-3 left-1/2 -translate-x-1/2 " +
            ` ${icon}-icon bg-${iconColor}-500`
          }
        ></div>
        <p className="max-w-md">{message}</p>
        <div className="w-80 absolute right-1/2 translate-x-1/2 bottom-2 flex gap-4 justify-around">
          <Button
            buttonType="default"
            text="Ok"
            className="w-1/2 left-1/2 -translate-x-/2"
            onClick={closePopup}
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
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to delete photo:", error);
        }
      } finally {
        closePopup();
      }
    };

    const popupContent = getPopupContent(
      "Are you sure you want to delete this photo?",
      deleteCallback,
      closePopup
    );

    openPopup(popupContent, "Please confirm the action");
  };

  const handlePhotoUpdate = async (
    updatedPhoto: Partial<Omit<PhotoCardProps, "id">>,
    formData: FormData
  ) => {
    try {
      await api.put(`/api/photos/${props.id}`, formData);
      setPhotoDetails((prevDetails) => ({
        ...prevDetails,
        ...updatedPhoto,
      }));
      setCacheInvalidationKey(new Date().getTime());
      setShowEditPopup(false);
      closePopup();
      if (props.refreshData) {
        props.refreshData(true);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to update the photo:", error);
      }
      openPopup(
        getAlertContent("Failed to update the photo!", "error", "red"),
        "Something went wrong"
      );
    }
  };

  return (
    <div className="relative h-fit">
      <PhotoCard
        {...photoDetails}
        cacheInvalidationKey={cacheInvalidationKey}
      />
      {imageLoaded && (
        <div className="absolute top-1 right-1 flex gap-2 bg-primary bg-opacity-30 p-3 hover:bg-opacity-50 rounded-xl">
          <div
            data-tooltip="Edit the photo"
            onClick={() => {
              handleEditClick(cacheInvalidationKey);
            }}
          >
            <div className="svg-mask edit-icon w-7 h-7 bg-cardText right-0 cursor-pointer hover:scale-125 transition-all" />
          </div>
          <div data-tooltip="Delete the photo" onClick={handleDeleteClick}>
            <div className="svg-mask delete-icon w-7 h-7 bg-red-700 right-6 top-0 cursor-pointer hover:scale-125 transition-all" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtendedPhotoCard;
