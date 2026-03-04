const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Додаємо підтримку файлів WebAssembly (.wasm)
config.resolver.assetExts.push('wasm');

// Додаємо HTTP-заголовки COEP та COOP для безпечної роботи SharedArrayBuffer у браузері
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(req, res, next);
  };
};

module.exports = config;