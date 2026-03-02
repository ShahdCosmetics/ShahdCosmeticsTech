import Image from "next/image";

// Backend'den ürünleri çeken fonksiyon
async function getProducts() {
  try {
    // Docker ağı içinde backend servisine istek atıyoruz
    const res = await fetch('http://backend:3000/products', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Veri çekilemedi:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-black dark:text-white">
      {/* Hero Section */}
      <nav className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tighter">SHAHD COSMETICS</h1>
      </nav>

      <main className="max-w-6xl mx-auto py-20 px-6">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-extrabold mb-4">Güzelliğinizi Keşfedin</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            En seçkin kozmetik ürünleri ve özel formüllerle tanışın.
          </p>
        </section>

        {/* Ürün Listeleme Alanı */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.length === 0 ? (
            <div className="col-span-3 text-center p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <p className="text-zinc-500">Henüz ürün eklenmemiş. Mutfakta (Backend) hazırlık yapılıyor...</p>
            </div>
          ) : (
            products.map((product: any) => (
              <div key={product.id} className="group border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl hover:shadow-xl transition-all">
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-4 overflow-hidden">
                  {/* Ürün görseli buraya gelecek */}
                </div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-zinc-500">{product.price} TL</p>
                <button className="mt-4 w-full bg-black dark:bg-white dark:text-black text-white py-2 rounded-lg font-medium">
                  Sepete Ekle
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}