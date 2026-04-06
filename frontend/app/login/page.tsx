// Server Component — no "use client" here.
// All interactivity is handled inside LoginForm.tsx.

import LoginForm from "./LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Shahd Cosmetics",
  description: "Sign in to your Shahd Cosmetics account.",
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      {/* Decorative background blobs */}
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />

      <div className="auth-card">
        {/* Brand header */}
        <div className="auth-header">
          <span className="brand-eyebrow">Shahd Cosmetics</span>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {/* The interactive form lives in a Client Component */}
        <LoginForm />
      </div>

      <style>{`
        /* ── Design tokens ─────────────────────────────────── */
        :root {
          --cream:   #faf7f4;
          --sand:    #e8ddd4;
          --rose:    #c9a898;
          --rose-dk: #a07060;
          --ink:     #2c2420;
          --muted:   #7a6a62;
          --error:   #b85c52;
          --radius:  12px;
        }

        /* ── Page layout ───────────────────────────────────── */
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--cream);
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
          font-family: 'Georgia', 'Times New Roman', serif;
        }

        /* Soft decorative blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          pointer-events: none;
        }
        .blob-1 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, #e8c4b8, #f5e0d8);
          top: -100px; right: -80px;
        }
        .blob-2 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, #d4c4bc, #e8d8d0);
          bottom: -80px; left: -60px;
        }

        /* ── Card ──────────────────────────────────────────── */
        .auth-card {
          position: relative;
          z-index: 1;
          background: #ffffff;
          border: 1px solid var(--sand);
          border-radius: 20px;
          padding: 3rem 2.5rem;
          width: 100%;
          max-width: 420px;
          box-shadow:
            0 4px 6px -1px rgba(44,36,32,.05),
            0 20px 60px -10px rgba(44,36,32,.12);
          animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Header ────────────────────────────────────────── */
        .auth-header {
          text-align: center;
          margin-bottom: 2.25rem;
        }
        .brand-eyebrow {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rose-dk);
          margin-bottom: 0.75rem;
        }
        .auth-title {
          font-size: 2rem;
          font-weight: 400;
          color: var(--ink);
          margin: 0 0 0.4rem;
          line-height: 1.2;
          font-style: italic;
        }
        .auth-subtitle {
          font-size: 0.875rem;
          color: var(--muted);
          margin: 0;
          font-family: system-ui, sans-serif;
        }

        /* ── Form shared (used by LoginForm & RegisterForm) ── */
        .shahd-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .field-label {
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--muted);
          font-family: system-ui, sans-serif;
        }
        .field-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid var(--sand);
          border-radius: var(--radius);
          font-size: 0.95rem;
          color: var(--ink);
          background: var(--cream);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: system-ui, sans-serif;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: #bbb; }
        .field-input:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(201,168,152,.2);
          background: #fff;
        }
        .error-message {
          font-size: 0.82rem;
          color: var(--error);
          background: rgba(184,92,82,.07);
          border: 1px solid rgba(184,92,82,.2);
          border-radius: 8px;
          padding: 0.6rem 0.9rem;
          margin: 0;
          font-family: system-ui, sans-serif;
        }
        .submit-btn {
          width: 100%;
          padding: 0.85rem;
          background: var(--ink);
          color: #fff;
          border: none;
          border-radius: var(--radius);
          font-size: 0.88rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          font-family: system-ui, sans-serif;
          margin-top: 0.25rem;
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--rose-dk);
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .switch-link {
          text-align: center;
          font-size: 0.82rem;
          color: var(--muted);
          margin: 0;
          font-family: system-ui, sans-serif;
        }
        .switch-link a {
          color: var(--rose-dk);
          text-decoration: none;
          font-weight: 600;
        }
        .switch-link a:hover { text-decoration: underline; }
      `}</style>
    </main>
  );
}
