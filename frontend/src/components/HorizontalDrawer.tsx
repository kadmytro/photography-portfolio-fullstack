import React, { useEffect, useState } from "react";

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

interface HorizontalDrawerProps {
  groups: Group[];
}

const HorizontalDrawer: React.FC<HorizontalDrawerProps> = ({ groups }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(
    groups[0].items[0] || null
  );

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
  };

  return (
    <div className="flex w-full overflow-x-clip contentHeight">
      <div className="relative min-w-300px max-w-400px bg-primary text-headerText p-4">
        <div className="sticky top-24 w-full">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
              <h2 className="text-xl font-semibold mb-2 border-b py-2  border-primaryText border-opacity-20">
                {group.title}
              </h2>
              <ul>
                {group.items.map((item) => (
                  <li
                    key={item.id}
                    className={`cursor-pointer p-2 rounded ${
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
      <div
        className={
          "flex-1 flex flex-col border-l border-primaryText border-opacity-30 " +
          (selectedItem?.stickyTitle ? " pt-8" : "")
        }
      >
        <div
          className={
            "text-2xl w-full font-bold px-8 pb-4 bg-primary " +
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
              <div className="flex-1 flex flex-col">{selectedItem.content}</div>
            </>
          ) : (
            <div className="text-primaryText text-opacity-70">
              Select an item to view its content
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorizontalDrawer;
