const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeProduct(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // User agent AR-like
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.setViewport({ width: 1366, height: 768 });
    
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Extract store from URL
    const store = new URL(url).hostname.replace('www.', '');

    // Robust selectors - multiple fallbacks
    const selectors = {
      title: [
        'h1',
        '.product-title',
        '.product__title',
        '[data-product-title]',
        '.woocommerce-product-details__short-description + h1',
        'h1.product_title'
      ],
      price: [
        '.price',
        '.product-price',
        '.amount',
        '[data-price]',
        '.woocommerce-Price-amount',
        '.price__regular'
      ],
      description: [
        '.product-description',
        '.description',
        '.product__description',
        '.woocommerce-product-details__short-description'
      ],
      images: [
        '.product-image img',
        '.product__media img',
        'img[data-src*="product"]',
        '.woocommerce-product-gallery__image img'
      ]
    };

    // Title
    let title = await page.evaluate((sels) => {
      for (let sel of sels) {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim()) return el.textContent.trim().substring(0, 200);
      }
      return document.title.trim();
    }, selectors.title);

    // Price (parse AR formats: $1.234, ARS 1.234)
    let price = 0;
    const priceText = await page.evaluate((sels) => {
      for (let sel of sels) {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim()) return el.textContent.trim();
      }
      return '';
    }, selectors.price);

    if (priceText) {
      const num = parseFloat(priceText.replace(/[^\d,.]/g, '').replace(',', '.'));
      price = isNaN(num) ? 0 : num;
    }

    // Description
    const description = await page.evaluate((sels) => {
      for (let sel of sels) {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim()) return el.textContent.trim().substring(0, 1000);
      }
      return '';
    }, selectors.description);

    // Images (first 5)
    const images = await page.evaluate((sels) => {
      const imgs = [];
      for (let sel of sels) {
        const els = document.querySelectorAll(sel);
        for (let el of els) {
          let src = el.src || el.dataset.src || el.dataset.lazySrc;
          if (src && !src.includes('placeholder') && imgs.length < 5) {
            if (!src.startsWith('http')) src = 'https://' + window.location.host + src;
            imgs.push(src);
          }
        }
        if (imgs.length >= 5) break;
      }
      return imgs;
    }, selectors.images);

    return {
      store,
      title,
      price,
      description,
      images
    };

  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeProduct };

