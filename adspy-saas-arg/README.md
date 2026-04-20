# AdSpy SaaS Argentina 🕵️‍♂️🇦🇷

## Producto Espía de Anuncios y Productos Ecommerce

Herramienta SaaS para **espionaje de anuncios Meta (Facebook Ads Library)** y **scraping automático de productos** en tiendas argentinas (Tiendanube, Shopify, WooCommerce).

### ✨ Features
- 🔍 **Buscar Anuncios**: Genera links directos a Facebook Ads Library (Argentina)
- 🛒 **Scraper Inteligente**: Extrae título, precio, descripción, imágenes automáticamente
- 📊 **Dashboard Pro**: Tabla filtrable, favoritos, detección de \"ganadores\"
- 💾 **Base de Datos**: MongoDB - guarda todo tu historial
- 🚀 **Listo para Deploy**: Vercel (Frontend) + Railway/Render (Backend)

## 🚀 Instalación Local (Windows)

### 1. Requisitos
```
- Node.js 20+
- MongoDB (local o Atlas: https://mongodb.com/atlas)
- Chrome (para Puppeteer)
```

### 2. Clonar/Setup
```
cd c:/Users/usuario/OneDrive/Desktop/scrap/adspy-saas-arg
```

### 3. Backend
```bash
cd backend
npm install
# Copia .env.example → .env con tu MONGO_URI
npm run dev
```
Backend corre en `http://localhost:5000`

### 4. Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend en `http://localhost:5173`

### 5. Docker (Opcional - Mongo Local)
```bash
docker-compose up -d
```

## 📱 Uso
1. **Ads Library**: Ingresa dominio/tienda → Abre FB Ads AR
2. **Scrape Producto**: Pega URL → Extrae data en segundos
3. **Dashboard**: Ve historial, filtra, marca favoritos

**Ejemplo AR**: Prueba con `https://ejemplo-tiendanube.com.ar/producto`

## 🌐 Deploy
### Frontend (Vercel)
```
vercel --prod
```

### Backend (Railway) - PRODUCCIÓN\n1. railway.com/app → New Project → Deploy from GitHub (repo con Procfile)\n2. Variables Env:\n   - `MONGO_URI`: mongodb+srv://... (Atlas gratis)\n   - `PORT`: 5000\n   - `FRONTEND_URL`: https://your-frontend.vercel.app\n3. URL backend: https://adspy-prod.up.railway.app\n\n**Nota Puppeteer**: Railway soporta headless.

## 🛠️ Estructura
```
adspy-saas-arg/
├── backend/     # Express + Puppeteer + Mongo
├── frontend/    # React + Tailwind + Vite
├── README.md
├── TODO.md
└── docker-compose.yml
```

## 🤖 Scraping Heuristics
- **Título**: h1, .product-title, [data-product-title]
- **Precio**: .price, .amount, data-price
- **Desc**: .description, .product-desc
- **Imgs**: .product-img src

## 🔒 Legal
Solo para investigación. Respeta robots.txt y términos de sitios.

## 📈 Próximos Pasos
- Autenticación Stripe
- API Keys por usuario
- Más detectores (ROI estimado)

¡Listo para escalar tu espionaje ecommerce! 🚀

