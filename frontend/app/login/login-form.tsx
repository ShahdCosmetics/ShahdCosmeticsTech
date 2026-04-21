"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

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
  setErrorMessage(data.message ?? "Invalid credentials. Please try again.");
  return;
}

// Store the JWT token in a cookie so the auth system can verify the session.
// SameSite=Strict prevents the cookie from being sent in cross-site requests.
document.cookie = `auth_token=${data.access_token}; path=/; SameSite=Strict`;

router.push("/");
    } catch {
      // Covers network-level failures (Docker down, no internet, etc.)
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleLoginSubmit} className="shahd-form" noValidate>
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
          autoComplete="current-password"
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
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>

      <div className="divider">
        <span className="divider-line" />
        <span className="divider-text">or</span>
        <span className="divider-line" />
      </div>

      <p className="switch-link">
        Don&apos;t have an account?{" "}
        <Link href="/register">Create one</Link>
      </p>
    </form>
  );
}