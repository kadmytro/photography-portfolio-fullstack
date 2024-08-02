import React, { useEffect, useState } from "react";
import api from "../services/api";
import LoadingWheel from "../components/LoadingWheel";

interface CategoryItem {
  id: number;
  name: string;
  description?: string;
}

const ListComponent: React.FC = () => {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<CategoryItem | null>(null);
  const [error, setError] = useState<string | null>(null); // For error messages

  // State to track original values for modified input highlight
  const [originalValues, setOriginalValues] = useState<{
    [key: number]: CategoryItem;
  }>({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get("api/categories/get");
        setItems(response.data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleEdit = (item: CategoryItem) => {
    setEditingItem(item);
    setOriginalValues((prev) => ({ ...prev, [item.id]: { ...item } }));
  };

  const handleSave = async () => {
    if (!editingItem || editingItem.name.trim() === "") {
      setError("Category name cannot be empty or whitespace only.");
      return;
    }

    setError(null);

    try {
      await api.put(`api/categories/put/${editingItem.id}`, editingItem);
      setItems(
        items.map((item) => (item.id === editingItem.id ? editingItem : item))
      );
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setNewItem(null);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`api/categories/delete/${id}`);
        setItems(items.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  const handleAddNewItem = () => {
    setNewItem({ id: 0, name: "", description: "" });
  };

  const handleSaveNewItem = async () => {
    if (!newItem || newItem.name.trim() === "") {
      setError("Category name cannot be empty or whitespace only.");
      return;
    }

    setError(null); // Clear error message

    try {
      const response = await api.post(`api/categories/post`, newItem);
      setItems([...items, { ...newItem, id: response.data }]);
      setNewItem(null);
    } catch (error) {
      console.error("Failed to add new item:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem({ ...editingItem, [name]: value });
    } else if (newItem) {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const isModified = (field: keyof CategoryItem) => {
    if (
      !editingItem ||
      !originalValues[editingItem.id] ||
      (!originalValues[editingItem.id][field] && !editingItem[field])
    )
      return false;
    return originalValues[editingItem.id][field] !== editingItem[field];
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
          <li
            key={item.id}
            className={
              "p-4 border rounded shadow min-w-500px bg-white text-gray-900"
            }
          >
            {editingItem?.id === item.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="name"
                  value={editingItem.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none ${
                    isModified("name") ? "bg-yellow-100" : ""
                  }`}
                  placeholder="Name"
                />
                <textarea
                  name="description"
                  value={editingItem.description}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none ${
                    isModified("description") ? "bg-yellow-100" : ""
                  }`}
                  placeholder="Description"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  {item.description && (
                    <p className="text-gray-600">{item.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
        {newItem && (
          <li className="p-4 border rounded shadow min-w-500px bg-white text-gray-900">
            <div className="space-y-2">
              <input
                type="text"
                name="name"
                value={newItem.name}
                required={true}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none ${
                  isModified("name") ? "border-blue-500" : ""
                }`}
                placeholder="Name"
              />
              <textarea
                name="description"
                value={newItem.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none ${
                  isModified("description") ? "border-blue-500" : ""
                }`}
                placeholder="Description"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewItem}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </li>
        )}
      </ul>
      <div className="flex justify-center mt-4">
        {!newItem && (
          <button
            onClick={handleAddNewItem}
            className="px-6 py-2 font-bold bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            + Add new
          </button>
        )}
      </div>
    </div>
  );
};

export default ListComponent;
