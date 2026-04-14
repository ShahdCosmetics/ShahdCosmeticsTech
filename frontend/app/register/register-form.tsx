"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();

  const [firstName, setFirstName]     = useState("");
  const [lastName, setLastName]       = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

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
        // Use the backend error message when available, otherwise show a safe fallback
        setErrorMessage(data.message ?? "Registration failed. Please try again.");
        return;
      }

      router.push("/");
    } catch {
      // Covers network-level failures (Docker down, no internet, etc.)
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleRegisterSubmit} className="shahd-form" noValidate>
      <div className="name-row">
        <div className="field-group">
          <label htmlFor="firstName" className="field-label">First Name</label>
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
          <label htmlFor="lastName" className="field-label">Last Name</label>
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

      <div className="field-group">
        <label htmlFor="email" className="field-label">Email Address</label>
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

      <div className="field-group">
        <label htmlFor="password" className="field-label">Password</label>
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

      {errorMessage && (
        <p role="alert" className="error-message">{errorMessage}</p>
      )}

      <button type="submit" disabled={isSubmitting} className="submit-btn">
        {isSubmitting ? "Creating account…" : "Create Account"}
      </button>

      <div className="divider">
        <span className="divider-line" />
        <span className="divider-text">or</span>
        <span className="divider-line" />
      </div>

      <p className="switch-link">
        Already have an account?{" "}
        <Link href="/login">Sign in</Link>
      </p>
    </form>
  );
}