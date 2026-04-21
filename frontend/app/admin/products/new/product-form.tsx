"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth";

interface Category { id: number; name: string; }

export default function ProductForm() {
  const router = useRouter();

  const [name, setName]                   = useState("");
  const [description, setDescription]     = useState("");
  const [price, setPrice]                 = useState("");
  const [imageUrl, setImageUrl]           = useState("");
  const [categoryId, setCategoryId]       = useState("");
  const [categories, setCategories]       = useState<Category[]>([]);
  const [errorMessage, setErrorMessage]   = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting]   = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          { headers: { Authorization: `Bearer ${getAuthToken()}` } }
        );
        if (res.ok) setCategories(await res.json());
      } catch {
        // Non-critical — the form still works without the category dropdown
      }
    }
    fetchCategories();
  }, []);

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            name, description,
            price: parseFloat(price),
            imageUrl,
            categoryId: parseInt(categoryId),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message ?? "Failed to create product.");
        return;
      }

      setSuccessMessage("Product created successfully.");
      router.push("/admin/products");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-form-card">
      <form onSubmit={handleCreateProduct} className="admin-form">
        <div className="field-group">
          <label className="field-label">Product Name</label>
          <input className="field-input" type="text" placeholder="e.g. Rose Lip Gloss" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field-group">
          <label className="field-label">Description</label>
          <input className="field-input" type="text" placeholder="Short product description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="field-group">
          <label className="field-label">Price (TL)</label>
          <input className="field-input" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="field-group">
          <label className="field-label">Image URL</label>
          <input className="field-input" type="text" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label">Category</label>
          <select className="field-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        {errorMessage   && <p className="error-message"   role="alert">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}