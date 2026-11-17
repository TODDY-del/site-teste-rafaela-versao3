// Tema claro/escuro: tokens de cor viram variáveis CSS (RGB), o Tailwind lê as variáveis.
const DARK = {
  'surface': '#161513', 'background': '#161513', 'surface-bright': '#2f2d29', 'surface-dim': '#0f0e0d',
  'surface-container-lowest': '#1f1d1a', 'surface-container-low': '#1b1a17', 'surface-container': '#252320',
  'surface-container-high': '#2e2c28', 'surface-container-highest': '#383530', 'surface-variant': '#383530',
  'on-surface': '#ece7df', 'on-background': '#ece7df', 'on-surface-variant': '#c4baab',
  'outline': '#948878', 'outline-variant': '#4d463b',
  'inverse-surface': '#0d0c0b', 'inverse-on-surface': '#f3f0eb', 'inverse-primary': '#7a581f', 'surface-tint': '#e3b872',
  'primary': '#d4a965', 'on-primary': '#2a1a00', 'primary-container': '#c49a5a', 'on-primary-container': '#2a1a00',
  'secondary': '#b8b2a8', 'on-secondary': '#1b1b1c', 'secondary-container': '#3a3835', 'on-secondary-container': '#d6d1c8',
  'tertiary': '#5fdc8d', 'on-tertiary': '#00391a', 'tertiary-container': '#00ba55', 'on-tertiary-container': '#002109',
  'error': '#ffb4ab', 'on-error': '#690005', 'error-container': '#93000a', 'on-error-container': '#ffdad6',
};
// Tema claro em tons de areia / marrom claro (em vez de branco puro)
const LIGHT = {
  'surface': '#f1e7d9', 'background': '#f1e7d9', 'surface-bright': '#f6eee2', 'surface-dim': '#d8cab6',
  'surface-container-lowest': '#faf4ea', 'surface-container-low': '#ebdfcd', 'surface-container': '#e5d8c4',
  'surface-container-high': '#ddceb7', 'surface-container-highest': '#d3c3aa', 'surface-variant': '#d3c3aa',
  'on-surface': '#2b2117', 'on-background': '#2b2117', 'on-surface-variant': '#5a4a37',
  'outline': '#8a7860', 'outline-variant': '#cbb9a0', 'secondary': '#6b5d4b',
};
const rgb = hex => { const n = parseInt(hex.slice(1), 16); return `${n >> 16} ${(n >> 8) & 255} ${n & 255}`; };

const EARLY = `<script>(function(){try{var u=location.search.match(/[?&]theme=(dark|light)/);var t=u?u[1]:localStorage.getItem('rr_theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.style.colorScheme=t;var m=location.search.match(/[?&]fotos=(reais|ilustrativas)/);var ph=m?(m[1]==='reais'?'real':'stitch'):localStorage.getItem('rr_photos');if(ph==='real')document.documentElement.setAttribute('data-photos','real');}catch(e){}})();</script>`;

const CSS = (light, dark) => `<style id="theme-vars">
:root{${Object.entries(light).map(([k, v]) => `--c-${k}:${rgb(v)}`).join(';')}}
html.dark{${Object.entries(dark).map(([k, v]) => `--c-${k}:${rgb(v)}`).join(';')};color-scheme:dark}
html{color-scheme:light}
img.img-real{display:none}
html[data-photos=real] img.img-real{display:block}
html[data-photos=real] img.img-stitch{display:none}
.photo-opt{color:#f3f0eb;opacity:.75}
.photo-opt[aria-pressed=true]{background:#c49a5a;color:#2a1a00;opacity:1}
input[type=range],input[type=checkbox],input[type=radio]{accent-color:#c49a5a}
@media (max-width:1023px){header.fixed{transition:top .3s ease}header.fixed.bar-hidden{top:calc(var(--bar-h,36px) * -1)}}
html.theme-anim *,html.theme-anim *::before,html.theme-anim *::after{transition:background-color .35s ease,color .35s ease,border-color .35s ease,fill .35s ease!important}
#theme-toggle .icon-sun,#theme-toggle .icon-moon{position:absolute;transition:transform .5s cubic-bezier(.4,0,.2,1),opacity .3s ease}
#theme-toggle .icon-sun{transform:translateY(120%) rotate(-90deg);opacity:0}
html.dark #theme-toggle .icon-moon{transform:translateY(-120%) rotate(90deg);opacity:0}
html.dark #theme-toggle .icon-sun{transform:none;opacity:1}
html.dark img:not([src*="logo"]){filter:brightness(.9) contrast(1.03)}
html.dark article{box-shadow:0 0 0 1px rgba(196,154,90,.14)}
html.dark [data-location]::before{content:"";position:absolute;inset:0;background:rgba(12,11,10,.5)}
html.dark .text-surface-container{color:#ebe8e3}
html.dark .text-surface-bright{color:#fcf9f4}
html.dark .text-surface-container-highest\\/40{color:rgba(229,226,221,.4)}
html.dark .text-surface-container-high\\/90{color:#fff}
html.dark ::selection{background:rgba(196,154,90,.35)}
html.dark .text-on-primary-container[class*="bg-primary-container/"]{color:rgb(var(--c-primary-fixed))}
html.dark .bg-primary.text-white,html.dark [class*="hover:bg-primary"][class*="hover:text-white"]:hover{color:rgb(var(--c-on-primary))}
</style>`;

const BTN = `<button type="button" id="theme-toggle" aria-pressed="false" aria-label="Ativar tema escuro" title="Alternar tema claro/escuro" class="relative w-10 h-10 shrink-0 rounded-full border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary hover:bg-surface-container-high transition-colors flex items-center justify-center overflow-hidden"><span class="material-symbols-outlined icon-moon text-[20px]" aria-hidden="true">dark_mode</span><span class="material-symbols-outlined icon-sun text-[20px]" aria-hidden="true">light_mode</span></button>`;

module.exports = function themeify(h) {
  // 1) tokens -> variáveis CSS
  const m = h.match(/<script id="tailwind-config">([\s\S]*?)<\/script>/);
  if (!m) return h;
  const light = {};
  let cfg = m[1].replace(/"([a-z-]+)":"(#[0-9a-fA-F]{6})"/g, (all, k, v) => { light[k] = v; return `"${k}":"rgb(var(--c-${k}) / <alpha-value>)"`; });
  Object.assign(light, LIGHT);
  const dark = Object.assign({}, light, DARK);
  h = h.replace(m[0], `<script id="tailwind-config">${cfg}</script>`);
  // 2) script anti-flash + CSS (antes do Tailwind)
  h = h.replace('<script src="https://cdn.tailwindcss.com"></script>', EARLY + CSS(light, dark) + '<script src="https://cdn.tailwindcss.com"></script>');
  // 3) logo: versão clara/escura
  h = h.replace(/<img alt="([^"]*)" class="h-12 w-auto object-contain" src="assets\/logo_rafaela_preta\.svg"\/>/, (a, alt) =>
    `<img alt="${alt}" class="h-12 w-auto object-contain dark:hidden" src="assets/logo_rafaela_preta.svg"/><img alt="${alt}" class="h-12 w-auto object-contain hidden dark:block" src="assets/logo_rafaela_branca.svg"/>`);
  // 4) botão no cabeçalho, antes do botão de WhatsApp
  h = h.replace(/(<header[\s\S]*?)(<a class="hidden sm:inline-flex)/, `$1${BTN}$2`);
  return h;
};
