import React, { useState, useRef, useEffect } from "react";
import api from "../services/api";
import { PhotoCardProps } from "../components/PhotoCard";
import MultiSelectDropdown from "./Category";

interface PhotoEditFormProps {
  photo: Omit<PhotoCardProps, "id">;
  onUpdate: (
    updatedPhoto: Partial<Omit<PhotoCardProps, "id">>
  ) => Promise<void>;
  onClose: () => void;
}

const PhotoEditForm: React.FC<PhotoEditFormProps> = ({
  photo,
  onUpdate,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState(photo.description || "");
  const [location, setLocation] = useState(photo.location || "");
  const [date, setDate] = useState(photo.date || "");
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    photo.categoriesIds ?? []
  );
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [updatedDimensions, setUpdatedDimensions] = useState({
    width: photo.width,
    height: photo.height,
  });
  const [changedFields, setChangedFields] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        setUpdatedDimensions({
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
        setChangedFields((prev) => [...prev, "file"]);
      };
    }
  }, [file]);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setMimeType(selectedFile.type);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setMimeType(null);
    setUpdatedDimensions({ width: photo.width, height: photo.height });
    setChangedFields((prev) => prev.filter((field) => field !== "file"));
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<any>>, field: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      if (!changedFields.includes(field)) {
        setChangedFields((prev) => [...prev, field]);
      }
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedPhoto: Partial<Omit<PhotoCardProps, "id">> = {};

    if (file) {
      updatedPhoto.image = URL.createObjectURL(file);
    }

    if (changedFields.includes("description")) {
      updatedPhoto.description = description;
    }

    if (changedFields.includes("location")) {
      updatedPhoto.location = location;
    }

    if (changedFields.includes("date")) {
      updatedPhoto.date = date;
    }

    if (changedFields.includes("file")) {
      updatedPhoto.width = updatedDimensions.width;
      updatedPhoto.height = updatedDimensions.height;
    }

    if (changedFields.includes("categories")) {
      updatedPhoto.categoriesIds = selectedCategories;
    }

    onUpdate(updatedPhoto);
    // Optionally, you can also send an update request to the backend here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex max-w-3xl mx-auto p-4 bg-white rounded shadow"
    >
      <div className="flex-1 mr-4">
        <img
          src={file ? URL.createObjectURL(file) : photo.image}
          alt={description}
          className="w-full h-auto shadow mb-4"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) =>
            e.target.files && handleFileChange(e.target.files[0])
          }
          className="hidden"
        />
        {file && (
          <button
            type="button"
            className="py-1 px-2 bg-red-500 text-white rounded hover:bg-red-700 mb-4"
            onClick={handleRemoveFile}
          >
            Remove File
          </button>
        )}
        <button
          type="button"
          className="py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          {file ? "Select another file" : "Select file"}
        </button>
      </div>
      <div className="flex-1">
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Description:
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleInputChange(setDescription, "description")}
            className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline ${
              changedFields.includes("description") ? "bg-yellow-100" : ""
            }`}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-gray-700 font-bold mb-2"
          >
            Location:
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={handleInputChange(setLocation, "location")}
            className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline ${
              changedFields.includes("location") ? "bg-yellow-100" : ""
            }`}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
            Date:
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleInputChange(setDate, "date")}
            className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline ${
              changedFields.includes("date") ? "bg-yellow-100" : ""
            }`}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="categories"
            className="block text-gray-700 font-bold mb-2"
          >
            Categories:
          </label>
          <MultiSelectDropdown
            initialSelection={selectedCategories}
            onSelectionChange={(categories) => {
              setSelectedCategories(categories);
              if (!changedFields.includes("categories")) {
                setChangedFields((prev) => [...prev, "categories"]);
              }
            }}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
        <button
          type="button"
          className="absolute top-0 right-0 mt-2 mr-2 py-1 px-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default PhotoEditForm;
