"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Use the message from the backend if available, otherwise use a fallback
        setError(data.message ?? "Invalid credentials. Please try again.");
        return;
      }

      // Success — redirect to homepage
      router.push("/");
    } catch {
      // Network-level failure (server unreachable, etc.)
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="shahd-form" noValidate>
      {/* Email */}
      <div className="field-group">
        <label htmlFor="email" className="field-label">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-input"
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div className="field-group">
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field-input"
          placeholder="••••••••"
        />
      </div>

      {/* Error message */}
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}

      {/* Submit */}
      <button type="submit" disabled={isLoading} className="submit-btn">
        {isLoading ? "Signing in…" : "Sign In"}
      </button>

      {/* Switch to register */}
      <p className="switch-link">
        Don&apos;t have an account?{" "}
        <Link href="/register">Create one</Link>
      </p>
    </form>
  );
}
