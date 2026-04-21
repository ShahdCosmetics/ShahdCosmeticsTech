"use client";

import { useState, useEffect } from "react";
import { getAuthToken } from "@/lib/auth";

interface Category { id: number; name: string; description: string; }

export default function CategoryTable() {
  const [categories, setCategories]     = useState<Category[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          { headers: { Authorization: `Bearer ${getAuthToken()}` }, cache: "no-store" }
        );
        if (!res.ok) { setErrorMessage("Failed to load categories."); return; }
        setCategories(await res.json());
      } catch {
        setErrorMessage("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  async function handleDeleteCategory(categoryId: number) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );
      if (!res.ok) { setErrorMessage("Failed to delete category."); return; }

      // Remove the deleted category from state without refetching the full list
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (isLoading) return <p className="table-empty">Loading categories...</p>;
  if (errorMessage) return <p className="table-error">{errorMessage}</p>;
  if (categories.length === 0) return <p className="table-empty">No categories yet. <a href="/admin/categories/new">Add your first category →</a></p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <a href={`/admin/categories/${category.id}/edit`} className="btn-edit">Edit</a>
                <button onClick={() => handleDeleteCategory(category.id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}