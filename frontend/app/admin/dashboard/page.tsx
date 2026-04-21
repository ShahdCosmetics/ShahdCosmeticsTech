import ProtectedRoute from "@/components/protected-route";

async function fetchDashboardStats() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`,   { cache: "no-store" }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { cache: "no-store" }),
    ]);
    const products   = productsRes.ok   ? await productsRes.json()   : [];
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    return { totalProducts: products.length, totalCategories: categories.length };
  } catch {
    return { totalProducts: 0, totalCategories: 0 };
  }
}

export default async function AdminDashboardPage() {
  const { totalProducts, totalCategories } = await fetchDashboardStats();

  return (
    <ProtectedRoute>
      <div className="admin-layout">

        <aside className="admin-sidebar">
          <div className="sidebar-brand">
            <span className="sidebar-monogram">S</span>
            <span className="sidebar-brand-name">Shahd Admin</span>
          </div>
          <nav className="sidebar-nav">
            <a href="/admin/dashboard" className="nav-item nav-item--active">
              <span className="nav-icon">▪</span> Dashboard
            </a>
            <a href="/admin/products" className="nav-item">
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
              <p className="admin-header-eyebrow">Overview</p>
              <h1 className="admin-header-title">Dashboard</h1>
            </div>
          </header>

          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Products</p>
              <p className="stat-value">{totalProducts}</p>
              <a href="/admin/products" className="stat-link">
                View all →
              </a>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total Categories</p>
              <p className="stat-value">{totalCategories}</p>
              <a href="/admin/categories" className="stat-link">
                View all →
              </a>
            </div>
          </div>
        </main>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --sidebar-bg:  #1e1814;
          --sidebar-border: rgba(255,255,255,.06);
          --cream:       #f9f4ef;
          --sand:        #e8ddd4;
          --rose:        #c4978a;
          --rose-dk:     #9a6a5a;
          --ink:         #28201c;
          --ink-lt:      #7a6a62;
          --white:       #ffffff;
          --serif:       'Playfair Display', Georgia, serif;
          --sans:        'Jost', system-ui, sans-serif;
          --radius:      12px;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
          font-family: var(--sans);
          background: var(--cream);
        }

        /* ── Sidebar ───────────────────────────── */
        .admin-sidebar {
          width: 220px;
          min-height: 100vh;
          background: var(--sidebar-bg);
          display: flex;
          flex-direction: column;
          padding: 2rem 0;
          position: fixed;
          top: 0; left: 0;
          z-index: 10;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0 1.5rem 2rem;
          border-bottom: 1px solid var(--sidebar-border);
          margin-bottom: 1.5rem;
        }

        .sidebar-monogram {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--rose), var(--rose-dk));
          color: white;
          font-family: var(--serif);
          font-style: italic;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-brand-name {
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255,255,255,.7);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0 0.75rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 0.75rem;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 400;
          color: rgba(255,255,255,.5);
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          letter-spacing: 0.02em;
        }
        .nav-item:hover { background: rgba(255,255,255,.06); color: rgba(255,255,255,.85); }
        .nav-item--active { background: rgba(196,151,138,.15); color: var(--rose); }
        .nav-icon { font-size: 0.5rem; opacity: 0.6; }

        /* ── Main content ──────────────────────── */
        .admin-main {
          margin-left: 220px;
          flex: 1;
          padding: 2.5rem 3rem;
        }

        .admin-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--sand);
        }

        .admin-header-eyebrow {
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rose-dk);
          margin-bottom: 0.3rem;
          font-weight: 500;
        }

        .admin-header-title {
          font-family: var(--serif);
          font-size: 2rem;
          font-weight: 400;
          font-style: italic;
          color: var(--ink);
        }

        /* ── Stat cards ────────────────────────── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          max-width: 600px;
        }

        .stat-card {
          background: var(--white);
          border: 1px solid var(--sand);
          border-radius: var(--radius);
          padding: 1.75rem;
          box-shadow: 0 2px 8px rgba(40,32,28,.05);
          transition: box-shadow 0.2s;
        }
        .stat-card:hover { box-shadow: 0 4px 16px rgba(40,32,28,.09); }

        .stat-label {
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-lt);
          font-weight: 500;
          margin-bottom: 0.6rem;
        }

        .stat-value {
          font-family: var(--serif);
          font-size: 2.8rem;
          font-weight: 400;
          color: var(--ink);
          line-height: 1;
          margin-bottom: 0.9rem;
        }

        .stat-link {
          font-size: 0.78rem;
          color: var(--rose-dk);
          text-decoration: none;
          font-weight: 500;
        }
        .stat-link:hover { text-decoration: underline; }
      `}</style>
    </ProtectedRoute>
  );
}