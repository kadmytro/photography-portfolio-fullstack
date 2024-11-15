import React, { useState, useRef, useEffect } from "react";
import { PhotoCardProps } from "../components/PhotoCard";
import Input from "../base_components/Input";
import ImageUploader from "../base_components/ImageUploader";
import Button from "../base_components/Button";
import TagBox from "../base_components/TagBox";

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
  const [caption, setCaption] = useState(photo.caption || "");
  const [location, setLocation] = useState(photo.location || "");
  const [date, setDate] = useState(photo.date || "");
  const [selectedCategories, setSelectedCategories] = useState<
    (number | string)[]
  >(photo.categoriesIds ?? []);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [updatedDimensions, setUpdatedDimensions] = useState({
    width: photo.width,
    height: photo.height,
  });
  const [changedFields, setChangedFields] = useState<string[]>([]);

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

  const handleFileChange = (selectedFile?: File) => {
    if (selectedFile) {
      handleRemoveFile();
      setFile(selectedFile);
      setMimeType(selectedFile.type);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setMimeType(null);
    setUpdatedDimensions({ width: photo.width, height: photo.height });
    setChangedFields((prev) => prev.filter((field) => field !== "file"));
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<any>>, field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    if (changedFields.includes("caption")) {
      updatedPhoto.caption = caption;
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
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col mobile:pt-10 wide:pt-4 wide:flex-row gap-4 narrow:max-w-lg wide:max-w-4xl mx-auto p-4 bg-card text-cardText rounded shadow"
    >
      <div className="flex-1 min-w-300px mobile:min-w-200px narrow:max-w-md">
        <ImageUploader
          editing={true}
          initialSource={photo.image}
          showFileDetails={true}
          imageChangeCallback={handleFileChange}
          hideDeleteButton={true}
        />
      </div>
      <div className="flex-1 self-center">
        <Input
          id="caption"
          label="Caption"
          value={caption}
          onChange={handleInputChange(setCaption, "caption")}
        />
        <Input
          id="location"
          label="Location"
          value={location}
          onChange={handleInputChange(setLocation, "location")}
        />
        <Input
          id="date"
          label="Date"
          type="date"
          value={date}
          onChange={handleInputChange(setDate, "date")}
        />
        <div className="mb-4">
          <label
            htmlFor="categories"
            className="block text-cardText font-bold mb-2"
          >
            Categories:
          </label>
          <TagBox
            dataSource="api/categories"
            initialSelection={selectedCategories}
            onSelectionChange={(categories) => {
              setSelectedCategories(categories);
              if (!changedFields.includes("categories")) {
                setChangedFields((prev) => [...prev, "categories"]);
              }
            }}
          />
        </div>
        <Button
          type="submit"
          text="Save changes"
          className="font-bold w-full"
        />
        <div
          className="absolute top-2 right-1 svg-mask close-icon w-7 h-7 bg-cardText cursor-pointer hover:scale-125 transition-all"
          onClick={onClose}
        />
      </div>
    </form>
  );
};

export default PhotoEditForm;
