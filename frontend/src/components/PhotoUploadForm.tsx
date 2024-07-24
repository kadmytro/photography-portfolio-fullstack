import React, { useState } from "react";
import axios from "axios";
import MultiSelectDropdown from "./Categoty";
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
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [mimeType, setMimeType] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setMimeType(selectedFile.type); 

      // Create a new Image object and set its src to the selected file's URL
      const image = new Image();
      image.src = URL.createObjectURL(selectedFile);

      // Set up an event listener to get the dimensions once the image is loaded
      image.onload = () => {
        setWidth(image.naturalWidth);
        setHeight(image.naturalHeight);
      };
    }
  };

  const handleCategoryChange = (categories: Category[]) => {
    setSelectedCategories(categories);
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

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("caption", caption);
    formData.append("location", location);
    
    if (date) {
      formData.append("date", date);
    }
    if (mimeType) {
      formData.append("mimeType", mimeType);
    }
    formData.append("width", width.toString());
    formData.append("height", height.toString());
    formData.append(
      "categories",
      JSON.stringify(selectedCategories.map((c) => c.id))
    );

    try {
      const response = await axios.post(
        "http://localhost:3001/api/photos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Photo uploaded successfully:", response.data);
      // Handle success: e.g., show a success message, reset form fields, etc.
    } catch (error) {
      console.error("Failed to upload photo:", error);
      // Handle error: e.g., show an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Date"
      />
      <MultiSelectDropdown onSelectionChange={handleCategoryChange} />
      <input type="file" onChange={handleFileChange} />
      {file ? (
        <div>
          <p>Selected File: {file.name}</p>
          {width && height && (
            <p>
              Dimensions: {width} x {height}
            </p>
          )}
        </div>
      ) : (
        <p>No file selected</p>
      )}
      <button type="submit">Upload Photo</button>
    </form>
  );
};

export default PhotoUploadForm;
