import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";

interface ImageUploaderProps {
  initialSource?: string | File | null;
  imageChangeCallback?: (file?: File) => void | undefined;
  editing?: boolean | undefined;
  showFileDetails?: boolean;
  hideDeleteButton?: boolean;
  /** maximum size of the file in MB */
  maxFileSize?: number; /// max File size in MB
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialSource = null,
  imageChangeCallback,
  editing,
  showFileDetails = false,
  hideDeleteButton = false,
  maxFileSize = null,
}) => {
  const init = !initialSource
    ? null
    : typeof initialSource === "string"
    ? initialSource
    : URL.createObjectURL(initialSource);
  const [imagePreview, setImagePreview] = useState<string | null>(init);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(file?: File) {
    if (imageChangeCallback === undefined) {
      return;
    }

    if (file === undefined) {
      resetUploader();
    } else {
      if (maxFileSize && file.size > maxFileSize * (1024 * 1024)) {
        alert(`File size should not exceed ${maxFileSize}MB`);
        resetUploader();
        return;
      }
      setImagePreview(URL.createObjectURL(file!));
      setMimeType(file.type);
      setFile(file);
    }

    imageChangeCallback(file);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      handleFileChange(file);
    }
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
    handleFileChange();
    setImagePreview(null);
  };

  const resetUploader = () => {
    setImagePreview(init);
    setFile(null);
    setHeight(null);
    setWidth(null);
    setMimeType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (imagePreview != null) {
      const image = new Image();
      image.src = imagePreview;

      image.onload = () => {
        setWidth(image.naturalWidth);
        setHeight(image.naturalHeight);
      };
    }
  }, [imagePreview]);

  useEffect(() => {
    if (!editing) {
      resetUploader();
    }
  }, [editing]);

  useEffect(() => {
    resetUploader();
  }, [initialSource]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`flex-1 wide:mb-4 p-4 wide:p-4 ${
        editing
          ? "border-dashed pb-4 border-2 border-gray-400 rounded-md"
          : " pb-0"
      } ${!imagePreview && " cursor-pointer"}`}
      onClick={() => editing && !imagePreview && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!imagePreview && (
        <div>
          <div className="svg-mask image-placeholder w-6 h-6 bg-gray-400 mx-auto" />
          <p className="text-gray-400 text-center">
            Drag and drop a file here or click to select a file
          </p>
        </div>
      )}
      {imagePreview && (
        <div className="mt-4">
          <img
            src={editing ? imagePreview! : init ?? undefined}
            alt="Preview"
            className="w-full h-auto shadow"
          />
          {showFileDetails && file && (
            <p className="text-gray-600 mt-2">Selected File: {file.name}</p>
          )}

          <p className="text-gray-600 h-6">
            {showFileDetails &&
              width &&
              height &&
              `Dimensions: ${width} x ${height}`}
          </p>
          <div
            className="w-full flex items-center justify-center mt-2"
            style={{
              display: editing ? "flex" : "none",
            }}
          >
            <Button
              buttonType="normal"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              text="Change file"
            />
            {!hideDeleteButton && (
              <Button
                buttonType="danger"
                onClick={handleRemoveFile}
                className="ml-4"
                text="Remove file"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
