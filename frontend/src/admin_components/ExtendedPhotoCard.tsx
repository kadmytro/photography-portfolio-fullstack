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

  useEffect(() => {
    setPhotoDetails(props);
  }, [props]);

  const handleEditClick = () => {
    setShowEditPopup(true);
  };

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
    <div className="relative">
      <PhotoCard {...photoDetails} />
      <div className="absolute bottom-0 left-0 w-full flex justify-between p-2 bg-primary bg-opacity-30 shadow-md">
        <button
          onClick={handleEditClick}
          className="py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={handleDeleteClick}
          className="py-1 px-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
      {showEditPopup && (
        <div className="fixed inset-0 w-screen h-screen overflow-auto flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded shadow-lg">
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
