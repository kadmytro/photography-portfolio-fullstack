import React, { useState, useRef, useEffect } from "react";
import api from "../services/api";
import LoadingWheel from "./../components/LoadingWheel"; // Import the LoadingWheel component
import Input from "../base_components/Input";
import ImageUploader from "../base_components/ImageUploader";
import Button from "../base_components/Button";
import TagBox from "../base_components/TagBox";

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
  const [selectedCategories, setSelectedCategories] = useState<
    (number | string)[]
  >([]);
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

  const handleFileChange = (selectedFile?: File) => {
    if (!selectedFile) {
      handleRemoveFile();
      return;
    }

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
        className="max-w-4xl mx-auto p-4 bg-card text-cardText rounded shadow relative"
      >
        <div className="w-full h-full flex gap-4 items-center">
          <div className="flex-1 min-w-300px">
            <ImageUploader
              editing={true}
              imageChangeCallback={handleFileChange}
              showFileDetails={true}
              initialSource={file ? URL.createObjectURL(file) : null}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Caption"
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <Input
              label="Location"
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Date"
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="mb-4">
              <label
                htmlFor="categories"
                className="block text-cardText font-bold mb-2"
              >
                Categories:
              </label>
              <TagBox
                dataSource="/api/categories"
                initialSelection={selectedCategories}
                onSelectionChange={setSelectedCategories}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <Button
            text="Upload Photo"
            type={"submit"}
            disabled={!file}
            className="w-1/2 font-bold"
          />
        </div>
        {loading && (
          <div className="absolute z-20 inset-0 bg-primary bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
            <LoadingWheel />
          </div>
        )}
      </form>
    </div>
  );
};

export default PhotoUploadForm;
