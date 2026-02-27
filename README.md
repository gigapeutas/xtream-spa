# xtream-spa (React + Vite + Netlify Functions)

## Rodar local
npm i
npm run dev

## Deploy Netlify
- Build command: npm run build
- Publish directory: dist

## Proxy (CORS)
Front chama:
  /.netlify/functions/xtream-proxy?target=<URL-ENCODED>

## Fluxo
Login -> carrega categorias -> lista itens -> player HLS (Hls.js)
