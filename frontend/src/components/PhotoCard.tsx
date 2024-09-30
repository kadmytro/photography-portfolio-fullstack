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
}

export const PhotoCard = ({ image, caption: caption }: PhotoCardProps) => {
  const [height, setHeight] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = () => {
    if (imgRef.current && containerRef.current) {
      const aspectRatio =
        imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      const containerWidth = containerRef.current.clientWidth;
      setHeight(containerWidth / aspectRatio);
    }
  };

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      handleImageLoad();
    }
    window.addEventListener("resize", handleImageLoad);
    return () => {
      window.removeEventListener("resize", handleImageLoad);
    };
  }, [image]);

  return (
    <div
      ref={containerRef}
      className="bg-white h-fit shadow-md overflow-hidden w-full"
    >
      <img
        ref={imgRef}
        src={image}
        alt={caption}
        onLoad={handleImageLoad}
        className="h-auto w-full object-cover cursor-pointer"
      />
    </div>
  );
};
