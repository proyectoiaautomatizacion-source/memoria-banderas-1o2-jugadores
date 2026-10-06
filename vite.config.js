import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Redirige /api/countries/* → https://api.restcountries.com/countries/*
        // El proxy inyecta el header Authorization para evitar exponerlo en el cliente
        // y también resuelve el bloqueo CORS en desarrollo local.
        '/api/countries': {
          target: 'https://api.restcountries.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/countries/, '/countries'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader(
                'Authorization',
                `Bearer ${env.VITE_RESTCOUNTRIES_API_KEY}`
              )
            })
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test-setup.js',
    },
  }
})
