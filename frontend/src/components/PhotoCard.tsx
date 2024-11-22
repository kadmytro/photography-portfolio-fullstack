import React, { useState, useEffect, useRef } from "react";

export interface PhotoCardProps {
  id: number;
  image: string;
  caption?: string;
  categoriesIds?: (number | string)[];
  location?: string;
  date?: string;
  height: number;
  width: number;
  cacheInvalidationKey?: number;
  imageLoadedCallback?: () => void;
}

export const PhotoCard = ({
  image,
  height,
  width,
  caption,
  cacheInvalidationKey,
  imageLoadedCallback,
}: PhotoCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageHeight, setImageHeight] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const key = cacheInvalidationKey ? `?t=${cacheInvalidationKey}` : ""

  const updateImageHeight = () => {
    if (containerRef.current) {
      const aspectRatio = width / height;
      const containerWidth = containerRef.current.clientWidth;
      setImageHeight(containerWidth / aspectRatio);
    }
  };

  const handleImageLoad = () => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
      imgRef.current.removeEventListener("load", handleImageLoad);
      if (imageLoadedCallback) {
        imageLoadedCallback();
      }
    }
  };

  useEffect(() => {
    updateImageHeight();
    window.addEventListener("resize", updateImageHeight);
    return () => {
      window.removeEventListener("resize", updateImageHeight);
    };
  }, [containerRef]);

  useEffect(() => {
    if (!imgRef.current) {
      return;
    }

    if (imgRef.current.complete) {
      handleImageLoad();
    } else {
      imgRef.current.addEventListener("load", handleImageLoad);
    }
  }, [imgRef]);

  return (
    <div
      ref={containerRef}
      className="h-fit bg-no-repeat box-content bg-contain shadow-md overflow-hidden w-full"
      style={
        imageLoaded
          ? {}
          : {
              backgroundImage: `url(${image}/small)`,
              height: `${imageHeight}px`,
            }
      }
    >
      <img
        ref={imgRef}
        src={`${image}${key}`}
        alt={caption}
        onLoad={handleImageLoad}
        loading="lazy"
        className={`h-auto w-full object-cover cursor-pointer transition-opacity ease-in-out ${
          !imageLoaded ? " opacity-0" : ""
        }`}
      />
    </div>
  );
};
