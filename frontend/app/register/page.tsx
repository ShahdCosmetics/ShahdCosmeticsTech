// Server Component — no "use client" needed here.
// All interactivity is delegated to the RegisterForm Client Component.

import RegisterForm from "./register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Shahd Cosmetics",
  description: "Create your Shahd Cosmetics account.",
};

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />

      {/* Decorative makeup illustration elements */}
      <svg className="deco-svg deco-top-left" aria-hidden="true" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="5" fill="#c4978a" opacity="0.5"/>
        <circle cx="40" cy="40" r="3" fill="#c4978a" opacity="0.35"/>
        <circle cx="80" cy="80" r="2" fill="#9a6a5a" opacity="0.4"/>
        <path d="M40 30 Q70 10 100 30 Q120 50 100 70 Q70 90 40 70 Q20 50 40 30Z" fill="none" stroke="#c4978a" strokeWidth="0.8" opacity="0.3"/>
        <path d="M90 20 Q110 35 105 55" fill="none" stroke="#9a6a5a" strokeWidth="0.6" opacity="0.25" strokeDasharray="3 4"/>
        <ellipse cx="55" cy="90" rx="14" ry="6" fill="#c4978a" opacity="0.15"/>
      </svg>

      <svg className="deco-svg deco-bottom-right" aria-hidden="true" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="140" r="4" fill="#c4978a" opacity="0.4"/>
        <circle cx="170" cy="160" r="6" fill="#c4978a" opacity="0.25"/>
        <path d="M120 100 Q150 80 180 100 Q200 120 180 140 Q150 160 120 140 Q100 120 120 100Z" fill="none" stroke="#c4978a" strokeWidth="0.8" opacity="0.25"/>
        <path d="M170 150 Q155 170 140 165" fill="none" stroke="#9a6a5a" strokeWidth="0.6" opacity="0.2" strokeDasharray="3 4"/>
        <ellipse cx="165" cy="115" rx="8" ry="14" fill="#c4978a" opacity="0.12"/>
      </svg>

      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-monogram">S</div>
          <span className="brand-eyebrow">Shahd Cosmetics</span>
          <h1 className="auth-title">Join us</h1>
          <p className="auth-subtitle">Create your account — it only takes a moment</p>
        </div>
        <RegisterForm />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream:   #f9f4ef;
          --sand:    #e2d5cc;
          --rose:    #c4978a;
          --rose-dk: #9a6a5a;
          --ink:     #28201c;
          --ink-lt:  #7a6a62;
          --error:   #b85040;
          --radius:  12px;
          --serif:   'Playfair Display', Georgia, serif;
          --sans:    'Jost', system-ui, sans-serif;
        }

        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cream);
          background-image:
            radial-gradient(ellipse 70% 50% at 20% 10%, rgba(196,151,138,.2) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 90%, rgba(196,151,138,.15) 0%, transparent 55%);
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
          font-family: var(--sans);
        }

        .grain-overlay {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.45;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }
        .blob-1 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(196,151,138,.28), rgba(240,224,216,.1));
          top: -150px; left: -100px;
          animation: drift 20s ease-in-out infinite alternate;
        }
        .blob-2 {
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(196,151,138,.18), rgba(213,192,180,.08));
          bottom: -90px; right: -70px;
          animation: drift 25s ease-in-out infinite alternate-reverse;
        }
        @keyframes drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(25px,18px) scale(1.04); }
        }

        .deco-svg {
          position: absolute;
          pointer-events: none;
          z-index: 0;
        }
        .deco-top-left  { width: 220px; height: 220px; top: 20px; left: 20px; }
        .deco-bottom-right { width: 200px; height: 200px; bottom: 20px; right: 20px; }

        .auth-card {
          position: relative;
          z-index: 1;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(226,213,204,.8);
          border-radius: 24px;
          padding: 3rem 2.75rem;
          width: 100%;
          max-width: 460px;
          box-shadow:
            0 2px 4px rgba(40,32,28,.04),
            0 12px 40px rgba(40,32,28,.09),
            0 40px 80px rgba(40,32,28,.05),
            inset 0 1px 0 rgba(255,255,255,.95);
          animation: cardIn 0.55s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .auth-header { text-align: center; margin-bottom: 2.25rem; }

        .brand-monogram {
          width: 46px; height: 46px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--rose), var(--rose-dk));
          color: white;
          font-family: var(--serif);
          font-size: 1.4rem;
          font-style: italic;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.9rem;
          box-shadow: 0 4px 16px rgba(154,106,90,.28);
        }

        .brand-eyebrow {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--rose-dk);
          margin-bottom: 0.55rem;
          font-family: var(--sans);
          font-weight: 500;
        }
        .auth-title {
          font-family: var(--serif);
          font-size: 2.1rem;
          font-weight: 400;
          font-style: italic;
          color: var(--ink);
          line-height: 1.15;
          margin-bottom: 0.35rem;
        }
        .auth-subtitle {
          font-size: 0.84rem;
          color: var(--ink-lt);
          font-weight: 300;
          font-family: var(--sans);
        }

        .shahd-form { display: flex; flex-direction: column; gap: 1.1rem; }

        .name-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .field-group { display: flex; flex-direction: column; gap: 0.35rem; }

        .field-label {
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-lt);
          font-weight: 500;
          font-family: var(--sans);
        }

        .field-input {
          width: 100%;
          padding: 0.78rem 1rem;
          border: 1.5px solid var(--sand);
          border-radius: var(--radius);
          font-size: 0.92rem;
          color: var(--ink);
          background: rgba(249,244,239,.65);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          font-family: var(--sans);
          font-weight: 300;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: #c0b0a8; }
        .field-input:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(196,151,138,.16);
          background: #fff;
        }

        .error-message {
          font-size: 0.8rem;
          color: var(--error);
          background: rgba(184,80,64,.055);
          border: 1px solid rgba(184,80,64,.16);
          border-radius: 10px;
          padding: 0.6rem 0.9rem;
          font-family: var(--sans);
          font-weight: 400;
        }

        .submit-btn {
          width: 100%;
          padding: 0.88rem;
          background: var(--ink);
          color: #fff;
          border: none;
          border-radius: var(--radius);
          font-size: 0.76rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.25s, transform 0.15s, box-shadow 0.25s;
          font-family: var(--sans);
          font-weight: 500;
          margin-top: 0.4rem;
          box-shadow: 0 4px 14px rgba(40,32,28,.16);
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--rose-dk);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(154,106,90,.28);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.2rem 0;
        }
        .divider-line { flex: 1; height: 1px; background: var(--sand); }
        .divider-text {
          font-size: 0.7rem;
          color: var(--ink-lt);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: var(--sans);
        }

        .switch-link {
          text-align: center;
          font-size: 0.82rem;
          color: var(--ink-lt);
          font-weight: 300;
          font-family: var(--sans);
        }
        .switch-link a {
          color: var(--rose-dk);
          text-decoration: none;
          font-weight: 500;
        }
        .switch-link a:hover { text-decoration: underline; }

        @media (max-width: 480px) {
          .auth-card { padding: 2.25rem 1.75rem; }
          .auth-title { font-size: 1.85rem; }
          .name-row { grid-template-columns: 1fr; }
          .deco-svg { display: none; }
        }
      `}</style>
    </main>
  );
}