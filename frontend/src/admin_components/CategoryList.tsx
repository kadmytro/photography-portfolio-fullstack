import React, { useEffect, useState } from "react";
import api from "../services/api";
import LoadingWheel from "../components/LoadingWheel";
import CategoryItem from "../types/CategoryItem";
import CategoryListItem from "./CategoryListItem";
import Button from "../base_components/Button";

interface CategoryListProps {
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  openPopupCallback,
  closePopupCallback,
}) => {
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

  const getPopupContent = (
    message: string,
    onConfirmCallback: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onCancelCallback: React.MouseEventHandler<HTMLButtonElement> | undefined
  ): React.ReactNode => {
    return (
      <div className="px-4 pb-12 pt-4 min-h-200px narrow:min-w-400px max-w-lg text-center border-t-1 border-primaryText border-opacity-30 relative content-center">
        <p className="max-w-md">{message}</p>
        <div className="narrow:w-80 w-4/5 absolute right-1/2 translate-x-1/2 bottom-2 flex gap-4 justify-around">
          <Button
            buttonType="default"
            text="Yes"
            className="flex-1"
            onClick={onConfirmCallback}
          />
          <Button
            buttonType="danger"
            text="No"
            className="flex-1"
            onClick={onCancelCallback}
          />
        </div>
      </div>
    );
  };

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
    const deleteCat = async () => {
      try {
        await api.delete(`api/categories/${id}`);
        setItems(items.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Failed to delete category:", error);
      } finally {
        if (closePopupCallback) {
          closePopupCallback();
        }
      }
    };

    const popupContent = getPopupContent(
      `Are you sure you want to delete the category "${
        items.find((i) => i.id === id)?.name ?? ""
      }"?`,
      deleteCat,
      closePopupCallback
    );

    if (openPopupCallback) {
      openPopupCallback(popupContent, "Please confirm the action");
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
    <div className="w-full narrow:max-w-2xl mx-auto p-1 narrow:p-4">
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

export default CategoryList;
