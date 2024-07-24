import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface MultiSelectDropdownProps {
  onSelectionChange: (selectedCategories: Category[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ onSelectionChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories from the server
    axios.get('http://localhost:3001/api/categories/get')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleSelection = (category: Category) => {
    if (selectedCategories.find(selected => selected.id === category.id)) {
      // Deselect category
      const updatedSelections = selectedCategories.filter(selected => selected.id !== category.id);
      setSelectedCategories(updatedSelections);
      onSelectionChange(updatedSelections);
    } else {
      // Select category
      const updatedSelections = [...selectedCategories, category];
      setSelectedCategories(updatedSelections);
      onSelectionChange(updatedSelections);
    }
  };

  return (
    <div className="multi-select-dropdown">
      <div className="dropdown">
        {categories.map(category => (
          <div
            key={category.id}
            className={`dropdown-item ${selectedCategories.find(selected => selected.id === category.id) ? 'selected' : ''}`}
            onClick={() => handleSelection(category)}
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
