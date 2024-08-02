import React, { useState } from "react";
import api from "../services/api";

const CategoryForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/categories/post",
        {
          name,
          description,
        },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setName("");
        setDescription("");
        alert("Category created successfully!");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 bg-white rounded shadow"
    >
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Category Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={true}
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Category Description:
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
      >
        Create Category
      </button>
    </form>
  );
};

export default CategoryForm;
