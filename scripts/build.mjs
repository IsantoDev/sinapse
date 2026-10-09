// Gera index.html (app PWA) e sw.js a partir de sinapse.html, que é a mesma fonte publicada no Claude.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const src = readFileSync('sinapse.html', 'utf8');
const head = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#071012">
<meta name="description" content="Feed de estudo de Análise de Dados, Ciência de Dados, ML e IA.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Sinapse">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>`;
const reg = `<script>
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
</script>`;
const html = `<!doctype html><html lang="pt-BR"><head>${head}</head><body>\n${src}\n${reg}\n</body></html>\n`;
writeFileSync('index.html', html);

const version = createHash('sha1').update(html).digest('hex').slice(0, 10);
const sw = readFileSync('scripts/sw.template.js', 'utf8').replace('__VERSION__', version);
writeFileSync('sw.js', sw);
console.log('index.html + sw.js gerados, versão', version);
