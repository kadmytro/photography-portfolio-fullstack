import React, { useEffect, useState } from "react";
import CategoryItem from "../types/CategoryItem";
import Input from "../base_components/Input";
import api from "../services/api";
import TextArea from "../base_components/TextArea";
import Button from "../base_components/Button";
import LoadingWheel from "../components/LoadingWheel";

interface CategoryListItemProps {
  category: CategoryItem;
  editingCategoryId: number | null;
  setEditingCategoryId: (
    categoryId: React.SetStateAction<number | null>
  ) => void;
  deleteCategory?: (id: number) => Promise<void> | null;
  updateCategory: (category: CategoryItem) => void;
  cancelCallback: () => void;
}

const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  editingCategoryId,
  setEditingCategoryId,
  deleteCategory,
  updateCategory,
  cancelCallback,
}) => {
  const isEditingCategory = editingCategoryId === category.id;
  const isNewCategory = category.id === -1;
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    isEditingCategory ? category : null
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    setEditingCategoryId(null);
    setError(null);
    cancelCallback();
  };

  const handleEdit = () => {
    if (editingCategoryId === category.id) {
      handleCancel();
      return;
    }
    handleCancel();
    setEditingCategoryId(category.id);
  };

  const handleDelete = () => {
    if (deleteCategory) {
      deleteCategory(category.id);
    }
  };

  useEffect(() => {
    if (editingCategoryId === category.id) {
      setEditingCategory(category);
    } else if (!isLoading) {
      setEditingCategory(null);
    }
  }, [editingCategoryId, category, isLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!editingCategory || !editingCategory.name) {
      setError("Category name cannot be empty."); //TODO CHECKS FOR ALL THE FIELDS TO BE FILLED
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      if (editingCategory.id === -1) {
        const response = await api.post(`api/categories/`, editingCategory);
        updateCategory({ ...editingCategory, id: response.data });
      } else {
        await api.put(`api/categories/${editingCategory.id}`, editingCategory);
        updateCategory(editingCategory);
      }
    } catch (error) {
      setError(`${error}`);
      console.error("Failed to update category:", error);
    } finally {
      setIsLoading(false);
      setEditingCategory(null);
      setEditingCategoryId(null);
    }
  };

  return (
    <li
      key={category.id}
      className={
        "p-4 relative rounded shadow min-w-500px bg-card text-cardText"
      }
    >
      <>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {isLoading && (
          <div className="absolute z-20 inset-0 bg-primary bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
            <LoadingWheel />
          </div>
        )}
        {editingCategoryId === category.id ? (
          <div className="space-y-2">
            <Input
              name="name"
              label="Category name"
              value={editingCategory ? editingCategory.name : category.name}
              onChange={handleChange}
            />
            <TextArea
              name="description"
              label="Description"
              value={
                editingCategory
                  ? editingCategory.description
                  : category.description
              }
              onChange={handleChange}
              className="min-h-100px"
            />
            <Input
              name="ordinal"
              label="Ordinal"
              value={
                editingCategory ? editingCategory.ordinal : category.ordinal
              }
              onChange={handleChange}
            />
            <div className="flex justify-end space-x-2">
              <Button
                buttonType="normal"
                onClick={handleCancel}
                text="Cancel"
              />
              <Button onClick={handleSave} text="Save" />
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center relative">
            {!isNewCategory && (
              <div className="absolute right-0 flex gap-2 z-10">
                <div
                  className="cursor-pointer svg-mask edit-icon w-7 h-7 bg-cardText right-0 hover:scale-125 transition-all"
                  onClick={handleEdit}
                ></div>
                <div
                  className="cursor-pointer svg-mask delete-icon w-7 h-7 bg-red-700 right-6 top-0 hover:scale-125 transition-all"
                  onClick={handleDelete}
                ></div>
              </div>
            )}
            <div className="w-5/6">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              {category.description && (
                <p className="text-gray-600">{category.description}</p>
              )}
            </div>
          </div>
        )}
      </>
    </li>
  );
};

export default CategoryListItem;
