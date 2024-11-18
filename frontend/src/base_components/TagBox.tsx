import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";

interface TagItem {
  id: number | string;
  name: string;
  description?: string;
}

interface TagBoxProps<T extends TagItem> {
  dataSource: T[] | string;
  label?: string;
  onSelectionChange: (selectedItems: (number | string)[]) => void;
  initialSelection?: (number | string)[];
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

const TagBox = <T extends TagItem>({
  dataSource,
  label,
  onSelectionChange,
  initialSelection = [],
  placeholder = "Select items",
  readOnly = false,
  className,
}: TagBoxProps<T>) => {
  const [items, setItems] = useState<T[]>(
    typeof dataSource === "string" ? [] : dataSource
  );
  const [selectedItems, setSelectedItems] =
    useState<(number | string)[]>(initialSelection);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof dataSource === "string") {
      api
        .get(dataSource as string)
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          console.error("Error fetching tags:", error);
        });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedItems(initialSelection);
  }, [initialSelection]);

  const handleSelection = (item: T) => {
    if (selectedItems.includes(item.id)) {
      const updatedSelections = selectedItems.filter(
        (itemId) => itemId !== item.id
      );
      setSelectedItems(updatedSelections);
      onSelectionChange(updatedSelections);
    } else {
      const updatedSelections = [...selectedItems, item.id];
      setSelectedItems(updatedSelections);
      onSelectionChange(updatedSelections);
    }
  };

  const handleRemoveTag = (item: T) => {
    const updatedSelections = selectedItems.filter(
      (itemId) => itemId !== item.id
    );
    setSelectedItems(updatedSelections);
    onSelectionChange(updatedSelections);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative mobile:w-full wide:min-w-400px narrow:max-w-lg wide:max-w-full ${
        className != undefined ? className : " "
      }`}
    >
      {label && (
        <label className="block text-cardText font-bold mb-2 pl-1">
          {label}:
        </label>
      )}
      <div
        className={
          "p-1 narrow:p-2 h-fit flex flex-wrap gap-1 narrow:gap-3 border bg-input text-inputText text-opacity-80 border-primaryText border-opacity-20 rounded focus:outline-none cursor-pointer " +
          (dropdownOpen ? "border-blue-500 border-opacity-100" : "")
        }
        onClick={() => !readOnly && setDropdownOpen(!dropdownOpen)}
      >
        {selectedItems.length === 0 ? (
          <p className="py-1.5">{placeholder}</p>
        ) : (
          selectedItems.map((itemId) => (
            <span
              key={itemId}
              className={
                "inline-flex items-center narrow:py-1 narrow:h-10 bg-blue-500 bg-opacity-20 drop-shadow text-cardText rounded-full" +
                (readOnly ? " px-4 narrow:px-6" : " pl-4 narrow:pl-6")
              }
            >
              {items.find((item) => item.id === itemId)?.name}
              {!readOnly && (
                <button
                  type="button"
                  className="px-2 narrow:px-4 text-center align-middle text-2xl font-bold text-red-500 hover:scale-125 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(items.find((item) => item.id === itemId)!);
                  }}
                >
                  &times;
                </button>
              )}
            </span>
          ))
        )}
      </div>
      {dropdownOpen && (
        <div className="absolute z-10 w-full drop-shadow mt-2 bg-input bg-opacity-95 text-inputText text-opacity-80 border-primaryText border-opacity-20 rounded shadow-lg">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-2 cursor-pointer hover:bg-blue-500 hover:bg-opacity-70 ${
                selectedItems.includes(item.id)
                  ? "bg-blue-500 bg-opacity-20 font-bold"
                  : ""
              }`}
              onClick={() => handleSelection(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagBox;
