"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth";

export default function CategoryForm() {
  const router = useRouter();

  const [name, setName]                   = useState("");
  const [description, setDescription]     = useState("");
  const [errorMessage, setErrorMessage]   = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting]   = useState(false);

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({ name, description }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message ?? "Failed to create category.");
        return;
      }

      setSuccessMessage("Category created successfully.");
      router.push("/admin/categories");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-form-card">
      <form onSubmit={handleCreateCategory} className="admin-form">
        <div className="field-group">
          <label className="field-label">Category Name</label>
          <input className="field-input" type="text" placeholder="e.g. Skincare" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field-group">
          <label className="field-label">Description</label>
          <input className="field-input" type="text" placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        {errorMessage   && <p className="error-message"   role="alert">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
}