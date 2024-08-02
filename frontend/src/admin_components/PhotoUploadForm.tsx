import React, { useState, useRef, useEffect } from "react";
import api from "../services/api";
import MultiSelectDropdown from "./Category";
import LoadingWheel from "./../components/LoadingWheel"; // Import the LoadingWheel component

interface Category {
  id: number;
  name: string;
  description: string;
}

const PhotoUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setMimeType(selectedFile.type);

    const image = new Image();
    image.src = URL.createObjectURL(selectedFile);

    image.onload = () => {
      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);
    };
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setWidth(null);
    setHeight(null);
    setMimeType(null);
  };

  const resetForm = () => {
    setFile(null);
    setCaption("");
    setLocation("");
    setDate("");
    setWidth(null);
    setHeight(null);
    setSelectedCategories([]);
    setMimeType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    if (width === null || height === null) {
      console.error("Image dimensions not available");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("caption", caption);
    formData.append("location", location);
    if (date) formData.append("date", date);
    if (mimeType) formData.append("mimeType", mimeType);
    formData.append("width", width.toString());
    formData.append("height", height.toString());
    formData.append("categories", JSON.stringify(selectedCategories));

    try {
      const response = await api.post("/api/photos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log("Photo uploaded successfully:", response.data);
      resetForm();
    } catch (error) {
      console.error("Failed to upload photo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-4 bg-white rounded shadow relative"
      >
        <div className="mb-4">
          <label
            htmlFor="caption"
            className="block text-gray-700 font-bold mb-2"
          >
            Caption:
          </label>
          <input
            type="text"
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
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
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
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
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline cursor-auto"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="categories" className="block text-gray-700 font-bold mb-2">
            Categories:
          </label>
          <MultiSelectDropdown
            onSelectionChange={(categories) =>
              setSelectedCategories(categories)
            }
          />
        </div>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() =>
            !file && fileInputRef.current && fileInputRef.current.click()
          }
          className="mb-4 p-4 border-dashed border-2 border-gray-300 rounded cursor-pointer"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) =>
              e.target.files && handleFileChange(e.target.files[0])
            }
            className="hidden"
          />
          {!file && (
            <div>
              <div className="svg-mask image-placeholder w-6 h-6 bg-gray-600 mx-auto" />
              <p className="text-gray-600 text-center">
                Drag and drop a file here or click to select a file
              </p>
            </div>
          )}
          {file && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-auto shadow"
              />
              <p className="text-gray-600 mt-2">Selected File: {file.name}</p>
              {width && height && (
                <p className="text-gray-600">
                  Dimensions: {width} x {height}
                </p>
              )}
              <div className="w-full flex items-center justify-center">
                <button
                  type="button"
                  className="mt-2 py-1 px-2 bg-blue-300 text-white rounded hover:bg-blue-500 mx-6"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                >
                  Select another file
                </button>
                <button
                  type="button"
                  className="mt-2 py-1 px-2 bg-red-500 text-white rounded hover:bg-red-700 mx-6"
                  onClick={handleRemoveFile}
                >
                  Remove File
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          disabled={!file} // Disable the button if no file is selected
        >
          Upload Photo
        </button>
        {loading && (
          <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center">
            <LoadingWheel />
          </div>
        )}
      </form>
    </div>
  );
};

export default PhotoUploadForm;
