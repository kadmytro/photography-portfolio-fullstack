import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { PhotoCard, PhotoCardProps } from "./PhotoCard";
import FullscreenImageViewer from "./FullScreenImageViewer";
import ExtendedPhotoCard from "../admin_components/ExtendedPhotoCard";
import useResizeObserver from "../base_components/useResizeObserver";

interface GalleryProps {
  initialWidth: number;
  items: PhotoCardProps[];
  admin?: boolean;
  refreshData?: () => void;
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
  containerDimensions?: { width: number; height: number };
}

export const Gallery = ({
  items = [],
  initialWidth,
  admin = false,
  refreshData,
  openPopupCallback,
  closePopupCallback,
  containerDimensions,
}: GalleryProps) => {
  const [columns, setColumns] = useState<number>(3);
  const [columnWidth, setColumnWidth] = useState<number>(300);
  const [containerRef, size] = useResizeObserver();

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedItemId, setselectedItemId] = useState(0);
  const [columnItems, setColumnItems] = useState<JSX.Element[][]>([]);

  useEffect(() => {
    const containerWidth = size.width;
    let numColumns = Math.round(containerWidth / 500) || 1;
    let width = containerWidth / numColumns - getRemSize();

    if (columnWidth !== width || numColumns !== columns) {
      calculateColumnsAndWidth();
    }
  }, [size]);

  const openViewer = (id: number) => {
    document.body.style.overflow = "hidden";
    setselectedItemId(id);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    document.body.style.overflow = "";
    setIsViewerOpen(false);
  };

  const getRemSize = () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return rem;
  };

  const calculateColumnsAndWidth = () => {
    const containerWidth = containerRef.current?.clientWidth || initialWidth;
    let numColumns = Math.round(containerWidth / 500) || 1;
    let width = containerWidth / numColumns - getRemSize();

    setColumns(numColumns);
    setColumnWidth(width);
  };

  const distributeItems = () => {
    const columnHeights: number[] = Array(columns).fill(0);
    const updatedColumnItems: JSX.Element[][] = Array.from(
      { length: columns },
      () => []
    );

    for (let i = 0; i < items.length; ) {
      let currentItemsNumber =
        i + columns < items.length ? columns : items.length - i;
      let currentItems = items.slice(i, i + currentItemsNumber);

      if (i > 0) {
        currentItems.sort((a, b) => {
          return a.width / a.height - b.width / b.height;
        });
      }

      currentItems.forEach((item, index) => {
        const minHeightIndex = columnHeights.indexOf(
          Math.min(...columnHeights)
        );
        const cardHeight = (item.height / item.width) * columnWidth;

        updatedColumnItems[minHeightIndex].push(
          <div
            key={item.id}
            className="mb-8"
            onClick={() => !admin && openViewer(item.id)}
          >
            {admin ? (
              <ExtendedPhotoCard
                {...item}
                refreshData={refreshData}
                openPopupCallback={openPopupCallback}
                closePopupCallback={closePopupCallback}
              />
            ) : (
              <PhotoCard {...item} />
            )}
          </div>
        );

        columnHeights[minHeightIndex] += cardHeight;
      });

      i += currentItemsNumber;
    }

    setColumnItems(updatedColumnItems);
  };

  useEffect(() => {
    distributeItems();
  }, [items, columns]);

  return (
    <div
      ref={containerRef}
      className={"flex flex-wrap" + ` narrow:px-${2 * columns}`}
    >
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div
          key={colIndex}
          className="flex-1 mx-2 narrow:mx-4"
          style={{ width: `${columnWidth}px` }}
        >
          {columnItems[colIndex]}
        </div>
      ))}
      {isViewerOpen && (
        <FullscreenImageViewer
          items={items}
          selectedItemId={selectedItemId}
          onClose={closeViewer}
        />
      )}
    </div>
  );
};
