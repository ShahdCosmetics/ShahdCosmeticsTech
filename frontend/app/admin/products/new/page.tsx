import ProtectedRoute from "@/components/protected-route";
import ProductForm from "./product-form";

export default function NewProductPage() {
  return (
    <ProtectedRoute>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="sidebar-brand">
            <span className="sidebar-monogram">S</span>
            <span className="sidebar-brand-name">Shahd Admin</span>
          </div>
          <nav className="sidebar-nav">
            <a href="/admin/dashboard" className="nav-item">
              <span className="nav-icon">▪</span> Dashboard
            </a>
            <a href="/admin/products" className="nav-item nav-item--active">
              <span className="nav-icon">▪</span> Products
            </a>
            <a href="/admin/categories" className="nav-item">
              <span className="nav-icon">▪</span> Categories
            </a>
          </nav>
        </aside>
        <main className="admin-main">
          <header className="admin-header">
            <div>
              <p className="admin-header-eyebrow">Inventory</p>
              <h1 className="admin-header-title">Add New Product</h1>
            </div>
            <a href="/admin/products" className="btn-back">← Back to Products</a>
          </header>
          <ProductForm />
        </main>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --sidebar-bg: #1e1814; --sidebar-border: rgba(255,255,255,.06);
          --cream: #f9f4ef; --sand: #e8ddd4; --rose: #c4978a; --rose-dk: #9a6a5a;
          --ink: #28201c; --ink-lt: #7a6a62; --white: #ffffff; --error: #b85040;
          --serif: 'Playfair Display', Georgia, serif; --sans: 'Jost', system-ui, sans-serif;
          --radius: 12px;
        }
        .admin-layout { display: flex; min-height: 100vh; font-family: var(--sans); background: var(--cream); }
        .admin-sidebar { width: 220px; min-height: 100vh; background: var(--sidebar-bg); display: flex; flex-direction: column; padding: 2rem 0; position: fixed; top: 0; left: 0; z-index: 10; }
        .sidebar-brand { display: flex; align-items: center; gap: .75rem; padding: 0 1.5rem 2rem; border-bottom: 1px solid var(--sidebar-border); margin-bottom: 1.5rem; }
        .sidebar-monogram { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--rose), var(--rose-dk)); color: white; font-family: var(--serif); font-style: italic; font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sidebar-brand-name { font-size: .8rem; font-weight: 500; color: rgba(255,255,255,.7); letter-spacing: .06em; text-transform: uppercase; }
        .sidebar-nav { display: flex; flex-direction: column; gap: .25rem; padding: 0 .75rem; }
        .nav-item { display: flex; align-items: center; gap: .6rem; padding: .65rem .75rem; border-radius: 8px; font-size: .84rem; color: rgba(255,255,255,.5); text-decoration: none; transition: background .2s, color .2s; }
        .nav-item:hover { background: rgba(255,255,255,.06); color: rgba(255,255,255,.85); }
        .nav-item--active { background: rgba(196,151,138,.15); color: var(--rose); }
        .nav-icon { font-size: .5rem; opacity: .6; }
        .admin-main { margin-left: 220px; flex: 1; padding: 2.5rem 3rem; }
        .admin-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--sand); }
        .admin-header-eyebrow { font-size: .68rem; letter-spacing: .2em; text-transform: uppercase; color: var(--rose-dk); margin-bottom: .3rem; font-weight: 500; }
        .admin-header-title { font-family: var(--serif); font-size: 2rem; font-weight: 400; font-style: italic; color: var(--ink); }
        .btn-back { font-size: .82rem; color: var(--ink-lt); text-decoration: none; font-weight: 400; align-self: center; }
        .btn-back:hover { color: var(--ink); }
        .admin-form-card { background: var(--white); border: 1px solid var(--sand); border-radius: var(--radius); padding: 2rem 2.5rem; max-width: 560px; box-shadow: 0 2px 8px rgba(40,32,28,.05); }
        .admin-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .field-group { display: flex; flex-direction: column; gap: .35rem; }
        .field-label { font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-lt); font-weight: 500; }
        .field-input, .field-select { width: 100%; padding: .78rem 1rem; border: 1.5px solid var(--sand); border-radius: 10px; font-size: .9rem; color: var(--ink); background: rgba(249,244,239,.6); outline: none; transition: border-color .2s, box-shadow .2s; font-family: var(--sans); font-weight: 300; }
        .field-input:focus, .field-select:focus { border-color: var(--rose); box-shadow: 0 0 0 3px rgba(196,151,138,.15); background: #fff; }
        .field-input::placeholder { color: #c0b0a8; }
        .error-message { font-size: .8rem; color: var(--error); background: rgba(184,80,64,.055); border: 1px solid rgba(184,80,64,.16); border-radius: 8px; padding: .6rem .9rem; }
        .success-message { font-size: .8rem; color: #3a7a4a; background: rgba(58,122,74,.06); border: 1px solid rgba(58,122,74,.18); border-radius: 8px; padding: .6rem .9rem; }
        .btn-primary { background: var(--ink); color: white; padding: .88rem 1.5rem; border: none; border-radius: var(--radius); font-size: .78rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: background .2s, transform .15s; font-family: var(--sans); margin-top: .4rem; }
        .btn-primary:hover:not(:disabled) { background: var(--rose-dk); transform: translateY(-1px); }
        .btn-primary:disabled { opacity: .5; cursor: not-allowed; }
      `}</style>
    </ProtectedRoute>
  );
}