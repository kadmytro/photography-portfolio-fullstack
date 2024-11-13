import React, { useEffect, useRef, useState } from "react";
import useResizeObserver from "../base_components/useResizeObserver";

interface Item {
  id: number;
  title: string;
  content: React.ReactNode;
  stickyTitle?: boolean;
  onClose?: () => void;
}

interface Group {
  title: string;
  items: Item[];
}

type ScreenType = "wide" | "narrow" | "mobile";

interface HorizontalDrawerProps {
  groups: Group[];
}

const HorizontalDrawer: React.FC<HorizontalDrawerProps> = ({ groups }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(
    groups[0].items[0] || null
  );
  const [isOpen, setIsOpen] = useState(true);
  const [screenType, setScreenType] = useState<ScreenType>("wide");
  const [contentRef, size] = useResizeObserver();
  const drawerMenuRef = useRef<HTMLDivElement>(null);
  const onResize = () => {
    const width = window.innerWidth;
    let newScreenType: ScreenType;

    if (width > 1000) {
      newScreenType = "wide";
    } else if (width > 750) {
      newScreenType = "narrow";
    } else {
      newScreenType = "mobile";
    }
    setScreenType(newScreenType);
  };

  useEffect(() => {
    onResize();
  });

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (screenType === "mobile" &&
        drawerMenuRef.current &&
        !drawerMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const foundItem = groups
      .flatMap((group) => group.items)
      .find((item) => selectedItem && item.id === selectedItem.id);

    if (foundItem) {
      setSelectedItem(foundItem);
    } else {
      if (groups.length > 0 && groups[0].items.length > 0) {
        setSelectedItem(groups[0].items[0]);
      } else {
        setSelectedItem(null);
      }
    }
  }, [groups]);

  useEffect(() => {
    if (selectedItem && selectedItem.onClose) {
      selectedItem.onClose();
    }
  }, [selectedItem]);

  const handleClick = (item: Item) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      if (window.scrollY != 0) {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });
      }
      setSelectedItem(item);
    }, 150);

    if (screenType === "mobile") {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex w-full overflow-x-clip contentHeight relative">
      <div
        className={`relative transition-all duration-300 text-headerText z-20 ${
          screenType === "mobile" && isOpen
            ? "bg-primary bg-opacity-10 min-w-full backdrop-blur-lg"
            : ""
        }`}
      >
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: isOpen ? "300px" : "0px",
            padding: isOpen ? "16px" : "0px",
          }}
          ref={drawerMenuRef}
        >
          <div className="sticky top-24 w-full">
            <button
              className="absolute top-1/2 -translate-y-1/2 w-4 hover:w-7 h-1/2
              rounded-tr-full rounded-br-full text-center text-4xl
              bg-tabSelected bg-opacity-40 hover:bg-opacity-70 duration-300 transition-all cursor-pointer"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              style={{ left: `calc(100% + ${isOpen ? 16 : 0}px)` }}
            >
              {isOpen ? "‹" : "›"}
            </button>
            {Array.isArray(groups) &&
              groups.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-4 overflow-x-hidden">
                  <h2
                    className={`text-xl font-semibold mb-2 border-b py-2 border-primaryText border-opacity-20 font-title whitespace-nowrap overflow-hidden`}
                  >
                    {group.title}
                  </h2>
                  <ul>
                    {group.items.map((item) => (
                      <li
                        key={item.id}
                        className={`cursor-pointer p-2 rounded whitespace-nowrap overflow-hidden ${
                          selectedItem && selectedItem.id === item.id
                            ? "bg-tabSelected bg-opacity-40 text-tabSelectedText"
                            : "bg-transparent text-tabRegularText text-opacity-70 hover:text-opacity-100  hover:bg-blue-500 hover:bg-opacity-20"
                        }`}
                        onClick={() => handleClick(item)}
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col border-primaryText border-opacity-30 min-w-400px ${
          selectedItem?.stickyTitle ? " pt-8" : ""
        } ${isOpen ? "border-l" : ""}`}
        style={{
          width: `calc(100% - ${isOpen ? 300 : 0}px)`,
          height: screenType === "mobile" ? `${size.height}px` : "",
        }}
      >
        <div
          ref={contentRef}
          className={`${
            screenType === "mobile" ? "absolute w-full left-0" : ""
          }`}
        >
          <div
            className={
              "text-2xl w-full font-bold px-8 pb-4 bg-primary font-title " +
              (selectedItem?.stickyTitle ? "pt-10 fixed top-14 z-20" : "pt-4")
            }
          >
            {selectedItem
              ? selectedItem.title
              : "Select an item to view its content"}
          </div>
          <div className="flex-1 flex flex-col p-8">
            {selectedItem ? (
              <>
                <div className="flex-1 flex flex-col">
                  {selectedItem.content}
                </div>
              </>
            ) : (
              <div className="text-primaryText text-opacity-70">
                Select an item to view its content
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalDrawer;
