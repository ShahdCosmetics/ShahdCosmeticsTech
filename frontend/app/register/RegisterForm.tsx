"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Use the message from the backend if available, otherwise use a fallback
        setError(data.message ?? "Registration failed. Please try again.");
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
      {/* Name row */}
      <div className="name-row">
        <div className="field-group">
          <label htmlFor="firstName" className="field-label">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="field-input"
            placeholder="Sara"
          />
        </div>

        <div className="field-group">
          <label htmlFor="lastName" className="field-label">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="field-input"
            placeholder="Ahmed"
          />
        </div>
      </div>

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
          autoComplete="new-password"
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
        {isLoading ? "Creating account…" : "Create Account"}
      </button>

      {/* Switch to login */}
      <p className="switch-link">
        Already have an account?{" "}
        <Link href="/login">Sign in</Link>
      </p>
    </form>
  );
}
