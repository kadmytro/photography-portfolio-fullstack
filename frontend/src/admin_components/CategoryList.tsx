import React, { useEffect, useState } from "react";
import api from "../services/api";
import LoadingWheel from "../components/LoadingWheel";
import CategoryItem from "../types/CategoryItem";
import CategoryListItem from "./CategoryListItem";
import Button from "../base_components/Button";

const ListComponent: React.FC = () => {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<CategoryItem | null>(null);
  const [error, setError] = useState<string | null>(null); // For error messages

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get("api/categories");
        setItems(response.data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  function updateCategory(category: CategoryItem): void {
    const isOld = items.some((s) => s.id === category.id);
    if (!isOld) {
      setNewItem(null);
    }
    const updatedCategories = isOld
      ? items.map((s) => (s.id === category.id ? category : s))
      : [...items, category];

    setItems(updatedCategories);
  }

  const handleCancel = () => {
    setEditingCategoryId(null);
    setNewItem(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`api/categories/${id}`);
        setItems(items.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleAddNewItem = () => {
    handleCancel();
    setNewItem({
      id: -1,
      name: "",
      description: "",
    });
    setEditingCategoryId(-1);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  if (loading) {
    return <LoadingWheel />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <ul className="space-y-4">
        {items.map((item) => (
          <CategoryListItem
            key={item.id}
            category={item}
            editingCategoryId={editingCategoryId}
            deleteCategory={handleDelete}
            setEditingCategoryId={setEditingCategoryId}
            updateCategory={updateCategory}
            cancelCallback={handleCancel}
          />
        ))}
        {newItem && (
          <CategoryListItem
            key={"newCategory"}
            category={newItem}
            editingCategoryId={editingCategoryId}
            deleteCategory={handleDelete}
            setEditingCategoryId={setEditingCategoryId}
            updateCategory={updateCategory}
            cancelCallback={handleCancel}
          />
        )}
      </ul>
      <div className="flex justify-center mt-4">
        {!newItem && (
          <Button
            text="+ Add new"
            onClick={handleAddNewItem}
            className="font-bold"
          />
        )}
      </div>
    </div>
  );
};

export default ListComponent;
