import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface MultiSelectDropdownProps {
  onSelectionChange: (selectedCategories: number[]) => void;
  initialSelection?: number[];
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  onSelectionChange,
  initialSelection = [],
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] =
    useState<number[]>(initialSelection);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get("/api/categories/get")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
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

  const handleSelection = (category: Category) => {
    if (selectedCategories.find((catId) => catId === category.id)) {
      const updatedSelections = selectedCategories.filter(
        (catId) => catId !== category.id
      );
      setSelectedCategories(updatedSelections);
      onSelectionChange(updatedSelections);
    } else {
      const updatedSelections = [...selectedCategories, category.id];
      setSelectedCategories(updatedSelections);
      onSelectionChange(updatedSelections);
    }
  };

  const handleRemoveTag = (category: Category) => {
    const updatedSelections = selectedCategories.filter(
      (catId) => catId !== category.id
    );
    setSelectedCategories(updatedSelections);
    onSelectionChange(updatedSelections);
  };

  return (
    <div ref={dropdownRef} className="relative min-w-400px">
      <div
        className="p-2 h-fit border bg-white text-black border-gray-300 rounded cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {selectedCategories.length === 0 ? (
          <p className="py-1.5">Select categories</p>
        ) : (
          selectedCategories.map((categoryId) => (
            <span
              key={categoryId}
              className="inline-flex items-center px-2 py-1 mr-2 bg-blue-100 text-blue-800 rounded-full"
            >
              {categories.find((c) => c.id == categoryId)?.name}
              <button
                type="button"
                className="ml-1 text-lg font-bold text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(categories.find((c) => c.id == categoryId)!);
                }}
              >
                &times;
              </button>
            </span>
          ))
        )}
      </div>
      {dropdownOpen && (
        <div className="absolute z-10 w-full mt-2 text-black bg-white border border-gray-300 rounded shadow-lg">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${
                selectedCategories.find((selected) => selected === category.id)
                  ? "bg-gray-300"
                  : ""
              }`}
              onClick={() => handleSelection(category)}
            >
              {category.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
