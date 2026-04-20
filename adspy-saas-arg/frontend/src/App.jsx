import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, LayoutDashboard, Star } from 'lucide-react';
import axios from 'axios';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(false);

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

  useEffect(() => {
    fetchProducts();
    fetchSearches();
  }, []);

  const fetchProducts = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const { data } = await axios.get(`${API_BASE}/products?${params}`);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSearches = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/searches`);
      setSearches(data);
    } catch (error) {
      console.error('Error fetching searches:', error);
    }
  };

  const handleScrape = async (url) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/products/scrape`, { url });
      setProducts([data, ...products]);
      alert(`✅ Producto scrapeado: ${data.title}`);
    } catch (error) {
      alert('❌ Error scraping: ' + (error.response?.data?.error || 'Try again'));
    }
    setLoading(false);
  };

  const handleSearch = async (query) => {
    try {
      const { data } = await axios.post(`${API_BASE}/searches`, { query });
      alert(`🔍 Ads Library: ${data.falUrl}\n(Se abrirá en nueva pestaña)`);
      window.open(data.falUrl, '_blank');
      fetchSearches();
    } catch (error) {
      alert('Error en búsqueda');
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const { data } = await axios.post(`${API_BASE}/products/${id}/favorite`);
      setProducts(products.map(p => p._id === id ? data : p));
    } catch (error) {
      console.error(error);
    }
  };

  const Sidebar = () => (
    <div className="w-64 h-screen bg-background/95 backdrop-blur supports-[backdrop-filter:blur(20px)]:bg-background/60 border-r border-border fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold gradient-text">AdSpy AR</h1>
        <p className="text-sm text-muted-foreground mt-1">Espía Ecommerce</p>
      </div>
      <nav className="p-4">
        <a onClick={() => setActiveTab('ads')} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 ${activeTab === 'ads' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
          <Search className="h-4 w-4" /> Buscar Ads
        </a>
        <a onClick={() => setActiveTab('scraper')} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 ${activeTab === 'scraper' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
          <ShoppingCart className="h-4 w-4" /> Scraper
        </a>
        <a onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${activeTab === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </a>
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-8 flex-1">
{activeTab === 'ads' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Search className="h-8 w-8" /> Facebook Ads Library AR
            </h2>
            <div className="max-w-md">
              <input 
                type="text" 
                placeholder="Nombre de tienda o dominio (ej: mercadolibre.com.ar)" 
e.key === 'Enter' && handleSearch(e.target.value)}
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary"
              />
              <button 
                onClick={() => handleSearch(document.querySelector('input[type=text]').value)}
                className="mt-4 w-full bg-primary text-primary-foreground p-4 rounded-lg font-medium hover:bg-primary/90"
              >
                🔍 Buscar Anuncios
              </button>
            </div>
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">Historial</h3>
              <ul>
                {searches.slice(0,5).map(s => (
                  <li key={s._id} className="p-3 border rounded-lg mb-2 hover:bg-accent cursor-pointer" onClick={() => window.open(s.falUrl, '_blank')}>
                    {s.query} 
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'scraper' &amp;&amp; (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <ShoppingCart className="h-8 w-8" /> Product Scraper
            </h2>
            <div className="max-w-2xl">
              <input 
                type="url" 
                placeholder="URL del producto (ej: https://tienda.com.ar/producto-xyz)" 
                id="scrapeUrl"
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary text-lg"
              />
              <button 
                onClick={async () => {
                  const url = document.getElementById('scrapeUrl').value;
                  if (url) handleScrape(url);
                }}
                disabled={loading}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-4 rounded-lg font-bold text-lg"
              >
                {loading ? '🕐 Scraping...' : '🚀 Extraer Producto'}
              </button>
              <p className="text-sm text-muted-foreground mt-2">
                Soporta Shopify, Tiendanube, WooCommerce, landing pages AR.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' &amp;&amp; (
          <div>
            <div className="flex gap-6 mb-8">
              <h2 className="text-3xl font-bold">Dashboard</h2>
              <input 
                placeholder="Filtrar por keyword..." 
                onChange={(e) => fetchProducts({ keyword: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2"
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {products.length === 0 ? (
                <p className="col-span-full text-center py-12 text-muted-foreground">
                  No hay productos. ¡Usa el scraper!
                </p>
              ) : (
                products.map(product => (
                  <div key={product._id} className="border rounded-xl p-6 hover:shadow-lg transition-all bg-card">
{product.images[0] && (
                      <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                    )}
                    <h3 className="font-bold text-xl mb-2 line-clamp-2">{product.title}</h3>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ${product.price?.toLocaleString('es-AR')} ARS
                    </p>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{product.description}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleFavorite(product._id)}
                        className={`p-2 rounded-lg ${product.isFavorite ? 'bg-yellow-400 text-yellow-900' : 'bg-muted hover:bg-accent'}`}
                        title="Favorito"
                      >
                        <Star className={`h-5 w-5 ${product.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <a href={product.url} target="_blank" rel="noopener" className="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        Ver Tienda
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

