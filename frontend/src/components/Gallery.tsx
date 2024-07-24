import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { PhotoCard, PhotoCardProps } from "./PhotoCard";
import FullscreenImageViewer from "./FullScreenImageViewer";

interface GalleryProps {
  initialWidth: number;
  items: PhotoCardProps[];
}

export const Gallery = ({ items, initialWidth }: GalleryProps) => {
  const [columns, setColumns] = useState<number>(3);
  const [columnWidth, setColumnWidth] = useState<number>(300); // Initial column width
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedItemId, setselectedItemId] = useState(0);
  
  const openViewer = (id: number) => {
    setselectedItemId(id);
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    document.body.style.overflow = '';
  };

  const getNumberOfColumns = (width: number): number => {
    if (width < 800) {
      return 1;
    } else if (width < 1024) {
      return 2;
    }

    return 3;
  };

  const getRemSize = () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return rem;
  };

  const calculateColumnsAndWidth = () => {
    const containerWidth = containerRef.current?.clientWidth || initialWidth;
    let numColumns = getNumberOfColumns(containerWidth); // Default number of columns
    let width = containerWidth / numColumns - getRemSize();

    setColumns(numColumns);
    setColumnWidth(width);
  };

  const distributeItems = () => {
    const columnHeights: number[] = Array(columns).fill(0);
    const columnItems: JSX.Element[][] = Array.from(
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

        columnItems[minHeightIndex].push(
          <div key={items.indexOf(item)} className="mb-4" onClick={() => openViewer(item.id)}>
            <PhotoCard {...item} />
          </div>
        );

        columnHeights[minHeightIndex] += cardHeight;
      });

      i += currentItemsNumber;
    }

    return columnItems;
  };

  useEffect(() => {
    calculateColumnsAndWidth();
    window.addEventListener("resize", calculateColumnsAndWidth);
    return () => {
      window.removeEventListener("resize", calculateColumnsAndWidth);
    };
  }, []);

  const columnItems = distributeItems();

  return (
    <div ref={containerRef} className="flex flex-wrap">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div
          key={colIndex}
          className="flex-1 mx-2"
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