"use client";

import { useState, useEffect } from "react";
import { getAuthToken } from "@/lib/auth";

interface Product {
  id: number;
  name: string;
  price: number;
  category?: { name: string };
}

export default function ProductTable() {
  const [products, setProducts]         = useState<Product[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          { headers: { Authorization: `Bearer ${getAuthToken()}` }, cache: "no-store" }
        );
        if (!res.ok) { setErrorMessage("Failed to load products."); return; }
        setProducts(await res.json());
      } catch {
        setErrorMessage("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  async function handleDeleteProduct(productId: number) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );
      if (!res.ok) { setErrorMessage("Failed to delete product."); return; }

      // Remove the deleted product from state without refetching the full list
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (isLoading) return <p className="table-empty">Loading products...</p>;
  if (errorMessage) return <p className="table-error">{errorMessage}</p>;
  if (products.length === 0) return <p className="table-empty">No products yet. <a href="/admin/products/new">Add your first product →</a></p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price} TL</td>
              <td>{product.category?.name ?? "Uncategorized"}</td>
              <td>
                <a href={`/admin/products/${product.id}/edit`} className="btn-edit">Edit</a>
                <button onClick={() => handleDeleteProduct(product.id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}