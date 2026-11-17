// Gera o site final (pasta ../site) a partir das telas do Stitch (pasta ../fonte) + dados dos imóveis (data.js).
// Uso:  node build/build.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'fonte'), OUT = path.join(ROOT, 'site');
const SITE = 'https://www.rafaelarequiimoveis.com.br'; // ajuste se o domínio for outro
const WA = '5516994602780';
const props = require('./data');
const blog = require('./blog');
const themeify = require('./theme');
const reviewsSection = require('./avaliacoes');
const financiamentoMain = require('./financiamento');
const paginas = require('./paginas');

const rd = f => fs.readFileSync(path.join(SRC, f), 'utf8');
const wr = (f, c) => fs.writeFileSync(path.join(OUT, f), c);
const brl = n => n.toLocaleString('pt-BR');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const waLink = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const urlOf = p => `imovel-${p.slug}.html`;
const must = (cond, msg) => { if (!cond) throw new Error('Marcador não encontrado: ' + msg); };
const cut = (h, a, b) => { const i = h.indexOf(a); const j = h.indexOf(b, i + 1); must(i >= 0 && j > i, a + ' → ' + b); return [h.slice(0, i), h.slice(i, j), h.slice(j)]; };
const replaceBetween = (h, a, b, rep) => { const [x, , z] = cut(h, a, b); return x + rep + z; };
const sub = (h, from, to) => { must(h.includes(from) || from instanceof RegExp, String(from).slice(0, 60)); return h.split(from).join(to); };
const priceTxt = p => !p.preco ? 'Consultar valor' : p.finalidade === 'aluguel' ? `R$ ${brl(p.preco)}/mês` : `R$ ${brl(p.preco)}`;

// ---------- pasta de saída ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
for (const f of fs.readdirSync(path.join(SRC, 'assets'))) if (f !== 'site.js') fs.copyFileSync(path.join(SRC, 'assets', f), path.join(OUT, 'assets', f));
fs.copyFileSync(path.join(__dirname, 'site.js'), path.join(OUT, 'assets', 'site.js'));
for (const f of fs.readdirSync(path.join(ROOT, 'imagens'))) fs.copyFileSync(path.join(ROOT, 'imagens', f), path.join(OUT, 'assets', f));

// ---------- <head>: SEO ----------
function setHead(h, { title, desc, file, img, ld = [], type = 'website' }) {
  const url = `${SITE}/${file === 'index.html' ? '' : file}`;
  const image = `${SITE}/assets/${img || 'img-85854d7fae.jpg'}`;
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  const tags = [
    `<meta name="description" content="${esc(desc)}"/>`,
    `<meta name="robots" content="index,follow,max-image-preview:large"/>`,
    `<link rel="canonical" href="${url}"/>`,
    `<meta name="theme-color" content="#C49A5A"/>`,
    `<link rel="icon" type="image/svg+xml" href="assets/logo_rafaela_preta.svg"/>`,
    `<meta property="og:locale" content="pt_BR"/><meta property="og:site_name" content="Rafaela Requi Imóveis"/>`,
    `<meta property="og:type" content="${type}"/><meta property="og:title" content="${esc(title)}"/>`,
    `<meta property="og:description" content="${esc(desc)}"/><meta property="og:url" content="${url}"/><meta property="og:image" content="${image}"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    ...ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`),
  ].join('\n');
  return h.replace('</head>', tags + '\n</head>');
}
const crumbs = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, f], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: `${SITE}/${f}` })) });

// ---------- ajustes comuns a todas as páginas ----------
function common(h) {
  h = h.replace(/(data-path="politica-de-privacidade" href=)"#"/g, '$1"politica-de-privacidade.html"');
  h = h.replace(/(data-path="termos-de-uso" href=)"#"/g, '$1"termos-de-uso.html"');
  h = h.replace(/(data-path="financiamento" href=)"[^"]*"/g, '$1"financiamento.html"');
  h = h.replace(/(data-path="sobre" href=)"[^"]*"/g, '$1"sobre.html"').replace(/(data-path="blog" href=)"[^"]*"/g, '$1"blog.html"').replace(/(data-path="contato" href=)"[^"]*"/g, '$1"contato.html"');
  h = h.replace(/<a aria-label="Instagram"[\s\S]*?<\/a><a aria-label="Facebook"[\s\S]*?<\/a>/, '');
  h = h.replace('© 2025', '© 2026');
  h = h.replace('<footer class="w-full bg-inverse-surface text-inverse-on-surface mt-space-xl">', '<footer class="w-full bg-inverse-surface text-inverse-on-surface mt-0">');
  // cabeçalho: sem foto de perfil e sem os links "Avaliação de Imóveis" / "Anuncie seu Imóvel"
  h = h.replace(/<img alt="Profile"[^>]*>/, '');
  h = h.replace(/<header[\s\S]*?<\/header>/, hd => hd.replace(/<a [^>]*data-path="(avaliacao-de-imoveis|anuncie-seu-imovel)"[^>]*>[^<]*<\/a>/g, '').replace(/<a [^>]*data-path="favoritos"[\s\S]*?<\/a>/, ''));
  // ícone oficial do WhatsApp no lugar do ícone de mensagem
  const WAI = (cls) => `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zM20.52 3.45A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.4z"/></svg>`;
  h = h.replace(/<aside class="fixed bottom-6 right-6[\s\S]*?<\/aside>/, `<aside class="fixed bottom-6 right-6 z-50"><a aria-label="Conversar no WhatsApp" class="relative group flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_20px_32px_-8px_rgba(30,30,30,0.25)] hover:scale-105 transition-all duration-300" href="https://wa.me/${WA}" rel="noopener noreferrer" target="_blank"><span class="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:opacity-40"></span>${WAI('w-8 h-8 relative z-10')}</a></aside>`);
  h = h.replace(/<a [^>]*wa\.me[^>]*>[\s\S]*?<\/a>/g, a => a.replace(/<span class="material-symbols-outlined([^"]*)">chat<\/span>/g, (m, c) => { const n = (c.match(/text-\[(\d+)px\]/) || [, '18'])[1]; const s = Math.round(+n * 1.05); return WAI(`shrink-0 ${/(text-(?!\[)[a-z-]+)/.test('') ? '' : ''}`.trim() + '" style="width:' + s + 'px;height:' + s + 'px'); }));
  h = h.replace(/<img(?![^>]*\salt=)/g, '<img alt="Imóveis em Igarapava e região – Rafaela Requi"');
  h = h.replace(/data-alt="[^"]*"/g, '');
  // botão do rodapé: alterna a imagem dos cards (ilustrativa x foto real)
  h = h.replace("</footer>", `<div class="bg-inverse-surface border-t border-white/10"><div class="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin py-3 flex flex-wrap items-center justify-center gap-3 text-inverse-on-surface font-label-sm text-label-sm"><span class="uppercase tracking-wider opacity-80">Imagens dos cards:</span><div class="inline-flex rounded-full border border-white/20 p-0.5" role="group" aria-label="Imagens dos cards"><button type="button" data-photos="stitch" class="photo-opt px-4 py-1.5 rounded-full font-semibold transition-colors" aria-pressed="true">Ilustrativas</button><button type="button" data-photos="real" class="photo-opt px-4 py-1.5 rounded-full font-semibold transition-colors" aria-pressed="false">Fotos reais</button></div></div></div></footer>`);
  return themeify(h);
}

// ---------- fotos reais: copiar para site/assets ----------
const FOTOS = path.join(ROOT, 'fotos-reais');
for (const p of props) {
  const dir = path.join(FOTOS, `imovel-${p.n}`);
  p.real = fs.readdirSync(dir).filter(f => /\.(png|jpe?g)$/i.test(f)).sort((a, b) => parseInt(a) - parseInt(b)).map(f => {
    const out = `real-${p.n}-${parseInt(f)}${path.extname(f).toLowerCase()}`;
    fs.copyFileSync(path.join(dir, f), path.join(OUT, 'assets', out));
    return out;
  });
}
const hasPrice = props.some(p => p.preco);
const tagOf = p => (p.n === 6 ? 'Cond. Náutico' : p.bairroLabel);
// duas imagens por card (ilustrativa do Stitch + foto real); o botão do rodapé alterna via html[data-photos]
const dualImg = (p, cls, alt) => `<img alt="${esc(alt)}" loading="lazy" class="${cls} img-stitch" src="assets/${p.stitch}"/><img alt="${esc(alt)} (foto real)" loading="lazy" class="${cls} img-real" src="assets/${p.real[0]}"/>`;

// ---------- cards ----------
const hotBadge = ['Exclusividade', 'Oportunidade', 'Novo'];
const colsOf = n => ({ 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[Math.min(4, Math.max(2, n))]);
function cardListing(p, i) {
  const specs = p.card.map(([ic, big, subt]) => `<div class="flex flex-col items-center"><span class="material-symbols-outlined text-primary text-[18px]">${ic}</span><span class="font-semibold mt-0.5">${esc(big)}</span><span class="text-[10px] text-outline">${esc(subt)}</span></div>`).join('');
  const price = p.preco ? `R$ ${brl(p.preco)}` : 'Consultar valor';
  return `<article class="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col relative" data-slug="${p.slug}" data-fin="${p.finalidade}" data-tipo="${p.tipo}" data-cidade="${p.cidade}" data-bairro="${p.bairro}" data-preco="${p.preco || ''}" data-quartos="${p.quartos || 0}" data-area="${p.area || 0}" data-feats="${p.feats.join(' ')}" data-ord="${i}">
<div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-dim">
${dualImg(p, 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500', `${p.titulo} – ${p.bairroLabel}, ${p.cidadeLabel}/SP`)}
<div class="absolute top-3 left-3 flex gap-1.5"><span class="${hotBadge.includes(p.badge) ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface'} font-label-sm text-label-sm px-2.5 py-1 rounded shadow-sm font-semibold tracking-wider uppercase">${esc(p.badge)}</span></div>
<div class="absolute top-3 right-3 z-10"><button aria-label="Favoritar este imóvel" class="fav-toggle w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-on-surface-variant hover:text-error transition-all shadow-sm" data-slug="${p.slug}" type="button"><span class="material-symbols-outlined text-[18px]">favorite</span></button></div>
<div class="absolute bottom-3 left-3 bg-inverse-surface/90 backdrop-blur-sm text-inverse-on-surface px-3 py-1.5 rounded-md shadow-sm"><span class="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed block leading-none">Venda</span><span class="font-title-md text-title-md font-bold text-white">${price}</span></div>
</div>
<div class="p-space-md flex flex-col flex-1 justify-between gap-3">
<div><div class="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm mb-1"><span class="material-symbols-outlined text-primary text-[15px]">location_on</span><span class="truncate">${esc(p.local)}</span></div>
<h3 class="font-headline-sm text-headline-sm text-on-surface line-clamp-1 group-hover:text-primary transition-colors">${esc(p.titulo)}</h3>
<p class="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1">${esc(p.resumo)}</p></div>
<div class="grid ${colsOf(p.card.length)} gap-2 pt-2 border-t border-surface-container bg-surface-container-low p-2 rounded-lg text-center font-label-sm text-label-sm text-on-surface">${specs}</div>
<div class="flex items-center justify-between pt-1"><span class="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-[15px]">verified</span> ${esc(p.cardNote)}</span>
<a class="inline-flex items-center gap-1 bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-on-primary-container font-label-md text-label-md px-3.5 py-2 rounded-md font-semibold transition-all after:absolute after:inset-0" href="${urlOf(p)}" aria-label="Ver detalhes: ${esc(p.titulo)}"><span>Ver Detalhes</span><span class="material-symbols-outlined text-[16px]">arrow_forward</span></a></div>
</div></article>`;
}
function cardHome(p) {
  const specs = p.card.map(([ic, big]) => `<div><span class="material-symbols-outlined text-[18px] text-primary block mx-auto">${ic}</span><span class="font-label-sm text-label-sm text-on-surface font-semibold">${esc(big)}</span></div>`).join('');
  return `<article class="relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
<div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-container">
${dualImg(p, 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500', `${p.titulo} – ${p.cidadeLabel}/SP`)}
<span class="absolute top-3 right-3 bg-inverse-surface/85 backdrop-blur-sm text-white font-label-sm text-label-sm px-2.5 py-1 rounded">${esc(tagOf(p))}</span>
<span class="absolute top-3 left-3 bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded uppercase tracking-wider font-semibold">Venda</span>
<div class="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface font-title-md text-title-md px-3 py-1.5 rounded shadow-sm">${p.preco ? 'R$ ' + brl(p.preco) : 'Consultar valor'}</div>
</div>
<div class="p-space-md flex flex-col flex-1">
<h3 class="font-headline-sm text-headline-sm text-on-surface line-clamp-1 group-hover:text-primary transition-colors">${esc(p.titulo)}</h3>
<p class="font-body-md text-body-md text-secondary line-clamp-2 mt-1 mb-4">${esc(p.resumo)}</p>
<div class="grid ${colsOf(p.card.length)} gap-1 py-3 bg-surface-container-low rounded-lg text-center mb-4 mt-auto">${specs}</div>
<a class="w-full py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary font-label-md text-label-md text-center transition-all after:absolute after:inset-0" data-path="imoveis" href="${urlOf(p)}" aria-label="Ver detalhes: ${esc(p.titulo)}">Ver detalhes do imóvel</a>
</div></article>`;
}
function cardSimilar(p) {
  const specs = p.card.slice(0, 3).map(([ic, big]) => `<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-primary">${ic}</span>${esc(big)}</span>`).join('');
  return `<article class="bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative">
<div class="relative h-56 overflow-hidden bg-surface-container">${dualImg(p, 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500', `${p.titulo} – ${p.cidadeLabel}/SP`)}
<div class="absolute top-3 right-3 px-2.5 py-1 rounded bg-inverse-surface/80 backdrop-blur-sm text-white font-label-sm text-label-sm font-semibold">${esc(tagOf(p))} • ${esc(p.cidadeLabel)}</div>
<div class="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-surface/95 backdrop-blur-sm shadow-sm"><span class="font-title-md text-title-md font-bold text-primary">${priceTxt(p)}</span></div></div>
<div class="p-5 flex flex-col flex-1 justify-between gap-4"><div class="flex flex-col gap-1.5"><span class="font-label-sm text-[11px] text-secondary">${p.ref} • ${esc(p.tipoLabel)}</span>
<h3 class="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1"><a href="${urlOf(p)}" class="after:absolute after:inset-0">${esc(p.titulo)}</a></h3>
<p class="font-body-md text-body-md text-on-surface-variant line-clamp-2">${esc(p.resumo)}</p></div>
<div class="flex items-center justify-between pt-3 border-t border-outline-variant/30 text-secondary text-label-sm font-label-sm gap-2 flex-wrap">${specs}</div></div></article>`;
}

// ---------- página de detalhe ----------
const LABEL = { bed: 'Dormitórios', directions_car: 'Garagem', outdoor_grill: 'Lazer', workspace_premium: 'Padrão', home: 'Tipo', location_city: 'Localização', kitchen: 'Cozinha', swap_horiz: 'Negociação', account_balance: 'Financiamento', sailing: 'Condomínio', pool: 'Lazer', landscape: 'Terreno' };
const longTxt = s => s.replace(/\bQts\b/, 'Quartos');
function similarOf(p) { const i = props.indexOf(p); return [1, 2, 3].map(k => props[(i + k) % props.length]); }

function detail(p) {
  let h = rd('imovel.html');
  const T = esc(p.titulo), R = p.real;
  // breadcrumb
  h = sub(h, '<a class="hover:text-primary transition-colors" href="#">Igarapava</a>', `<a class="hover:text-primary transition-colors" href="imoveis.html">${p.cidadeLabel}</a>`);
  h = sub(h, '<a class="hover:text-primary transition-colors" href="#">Residencial Planalto</a>', `<a class="hover:text-primary transition-colors" href="imoveis.html?bairro=${p.bairro}">${esc(p.bairroLabel)}</a>`);
  h = h.replace(/<span class="text-outline-variant hidden sm:inline">\|<\/span>\s*<span[^>]*>Atualizado há 3 dias<\/span>/, '');
  h = h.replace(/(<span class="px-2\.5 py-1 rounded-md bg-primary-container\/20[^>]*>)\s*Exclusividade Rafaela Requi\s*(<\/span>)/, '$1 Imóvel real Rafaela Requi $2');
  h = h.replace(/(<span class="px-2\.5 py-1 rounded-md bg-surface-container text-secondary[^>]*>)\s*Casa Térrea\s*(<\/span>)/, `$1 ${esc(p.tipoLabel)} $2`);
  h = h.replace(/(<h1[^>]*>)[\s\S]*?(<\/h1>)/, `$1 ${T} $2`);
  h = sub(h, 'Residencial Planalto • Igarapava / SP (Região nobre e arborizada)', `${esc(p.local.replace(' • ', ' • ').replace('–', '/'))}`);
  // preço
  h = h.replace(/<div class="flex items-baseline gap-1">[\s\S]*?<\/div>/, '<span class="font-display text-headline-md text-primary leading-none">Consultar valor</span>');
  h = sub(h, 'Valor de Investimento', 'Valor');
  h = sub(h, 'Aceita Financiamento Bancário &amp; Carta de Crédito', p.financia ? 'Aceita financiamento bancário e permuta' : 'Condições e valor sob consulta');

  // galeria com as fotos reais
  const N = R.length;
  const tile = (i, extra = '') => `<div class="relative group overflow-hidden bg-surface-container rounded-lg cursor-pointer" onclick="openPhotoModal(${i})"><img alt="${T} – foto ${i + 1}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="assets/${R[i]}"/>${extra || '<div class="absolute inset-0 bg-inverse-surface/10 group-hover:bg-transparent transition-colors"></div>'}</div>`;
  const more = `<div class="absolute inset-0 bg-inverse-surface/60 group-hover:bg-inverse-surface/40 transition-colors flex flex-col items-center justify-center text-white text-center p-2"><span class="material-symbols-outlined text-[28px] text-primary-fixed mb-1">collections</span><span class="font-title-md text-[14px] font-bold leading-tight">Ver todas as ${N} fotos</span></div>`;
  const main = `<div class="md:col-span-8 relative group overflow-hidden bg-surface-container h-[340px] sm:h-[460px] cursor-pointer" onclick="openPhotoModal(0)"><img alt="${T} – ${esc(p.bairroLabel)}, ${p.cidadeLabel}/SP" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" id="main-gallery-view" src="assets/${R[0]}"/><div class="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent opacity-80 pointer-events-none"></div><div class="absolute bottom-4 left-4 flex items-center gap-2 text-white"><span class="px-2.5 py-1 rounded bg-inverse-surface/80 backdrop-blur-sm font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px] text-primary-fixed">photo_camera</span><span>${N} fotos</span></span></div></div>`;
  const gal = `<section class="w-full bg-surface py-4"><div class="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin"><div class="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-2xl overflow-hidden shadow-sm">${main}<div class="md:col-span-4 grid grid-cols-2 gap-3 h-[340px] sm:h-[460px]">${tile(1)}${tile(2)}${tile(3)}${tile(4, more)}</div></div></div></section>\n`;
  h = replaceBetween(h, '<!-- Editorial Photo Gallery Mosaic -->', '<!-- Quick Specification Bar -->', '<!-- Galeria -->' + gal);

  // barra de especificações
  const cells = p.card.map(([ic, big, subt]) => `<div class="flex items-center gap-3 bg-surface p-3.5 rounded-xl shadow-sm"><div class="w-10 h-10 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">${ic}</span></div><div class="flex flex-col"><span class="font-label-sm text-label-sm text-secondary uppercase">${LABEL[ic] || 'Destaque'}</span><span class="font-title-md text-title-md text-on-surface font-bold">${esc(longTxt(big))}</span>${subt ? `<span class="font-label-sm text-[11px] text-on-surface-variant">${esc(subt)}</span>` : ''}</div></div>`).join('');
  h = replaceBetween(h, '<!-- Quick Specification Bar -->', '<!-- Main Split Layout', `<!-- Quick Specification Bar -->\n<section class="w-full bg-surface-container-low py-4 shadow-sm"><div class="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin"><div class="grid grid-cols-2 lg:${colsOf(p.card.length).replace('grid-', 'grid-')} gap-3">${cells}</div></div></section>\n`);

  // seção 1: descrição
  const hl = p.chips.slice(0, 3).map(([ic, t]) => `<div class="bg-surface p-3.5 rounded-xl flex items-center gap-3"><span class="material-symbols-outlined text-primary text-[24px]">${ic}</span><div class="flex flex-col"><span class="font-label-sm text-[11px] text-secondary">Destaque</span><span class="font-body-md text-body-md font-semibold text-on-surface">${esc(t)}</span></div></div>`).join('');
  const closing = 'Para agendar uma visita ou saber o valor e as condições, fale diretamente com a Rafaela Requi, corretora e avaliadora de imóveis (CRECI 217 650-F).';
  h = replaceBetween(h, '<!-- Section 1', '<!-- Section 2', `<!-- Section 1 -->\n<div class="bg-surface-container-low p-6 sm:p-8 rounded-2xl flex flex-col gap-5"><div class="flex items-center gap-2 text-primary"><span class="material-symbols-outlined text-[24px]">description</span><h2 class="font-headline-sm text-headline-sm text-on-surface">Sobre este imóvel</h2></div><div class="font-body-lg text-body-lg text-on-surface-variant flex flex-col gap-4 text-justify leading-relaxed">${[...p.desc, closing].map(t => `<p>${t}</p>`).join('')}</div><div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">${hl}</div></div>\n`);
  // seção 2: características
  const feat = p.chips.map(([ic, t]) => `<div class="flex items-center gap-2.5 p-3 rounded-lg bg-surface text-on-surface"><span class="material-symbols-outlined text-tertiary text-[20px]">${ic}</span><span class="font-body-md text-body-md font-medium">${esc(t)}</span></div>`).join('');
  h = replaceBetween(h, '<!-- Section 2', '<!-- Section 3', `<!-- Section 2 -->\n<div class="bg-surface p-6 sm:p-8 rounded-2xl bg-surface-container-low flex flex-col gap-6"><div class="flex items-center gap-2 text-primary"><span class="material-symbols-outlined text-[24px]">checklist</span><h2 class="font-headline-sm text-headline-sm text-on-surface">Características do Imóvel</h2></div><div class="grid grid-cols-2 sm:grid-cols-3 gap-3">${feat}</div></div>\n`);
  h = replaceBetween(h, '<!-- Section 3', '<!-- Section 4', '');
  // seção 4: localização
  h = sub(h, 'Localização no Residencial Planalto', `Localização – ${esc(p.bairroLabel)}`);
  h = sub(h, 'Igarapava+SP+Residencial+Planalto', encodeURIComponent(`${p.bairroLabel} Igarapava SP`).replace(/%20/g, '+'));
  h = sub(h, '<span class="font-label-md text-label-md font-semibold">Igarapava – Alta Mogiana</span>', `<span class="font-label-md text-label-md font-semibold">${p.cidadeLabel} – SP</span>`);
  h = sub(h, 'data-location="Residencial Planalto, Igarapava - SP, Brazil"', `data-location="${esc(p.bairroLabel)}, ${p.cidadeLabel} - SP, Brazil"`);
  h = replaceBetween(h, '<!-- Neighborhood Proximity Badges -->', '<!-- Section 5', '</div>\n');
  // seção 5 (simulador): sem valor de venda, não se aplica
  h = replaceBetween(h, '<!-- Section 5', '<!-- Section 6', '');
  // seção 6 + garantias
  h = sub(h, 'Parecer Técnico Mercadológico Validado', 'Avaliação com Rafaela Requi');
  h = h.replace(/Este imóvel teve sua precificação[\s\S]*?adquirente\./, 'O valor deste imóvel é informado diretamente pela Rafaela. Fale com ela para conhecer as condições, agendar a visita e conferir a documentação com segurança antes de fechar negócio.');
  h = sub(h, 'Matrícula individualizada e sem gravames', 'Conferência da documentação antes da proposta');
  h = sub(h, 'Habite-se averbado na matrícula', 'Visitas com hora marcada');
  h = sub(h, 'Vistoria estrutural e elétrica aprovada', 'Apoio na negociação e no contrato');
  h = sub(h, 'Assessoria jurídica integral até a escritura', 'Atendimento direto com a corretora');
  h = sub(h, 'Garantias deste Imóvel', 'Como é o atendimento');
  h = sub(h, 'REF-RR204', p.ref);
  h = sub(h, 'Casa Térrea no Residencial Planalto - Igarapava/SP', esc(p.titulo));
  // semelhantes
  const g = h.indexOf('<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">', h.indexOf('<!-- Similar'));
  const e = h.indexOf('<!-- Photo Modal'); must(g > 0 && e > g, 'similares');
  h = h.slice(0, g) + `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${similarOf(p).map(cardSimilar).join('\n')}</div></div></section>\n` + h.slice(e);
  // modal
  h = h.replace(/const galleryItems = \[[\s\S]*?\];/, `const galleryItems = ${JSON.stringify(R.map(x => 'assets/' + x))};`);
  h = h.replace(/\(1 de 5\)/, `(1 de ${N})`);
  h = sub(h, 'Use as setas para navegar entre as fotos da residência', 'Use as setas para navegar entre as fotos do imóvel');
  // scripts
  h = sub(h, 'const baseValue = 580000;', 'const baseValue = 0;');
  h = h.replace(/if \(downRange && termSelect\) \{[\s\S]*?\n    \}\n/, '');
  h = h.replace(/\/\/ 2\. Favorite Toggle Micro-interaction[\s\S]*?(?=\/\/ 3\. Share Button)/, '');
  h = h.replace(/function handleBrokerContactSubmit\(\) \{[\s\S]*?\n    \}\n/, `function handleBrokerContactSubmit() {
      const v = id => document.getElementById(id).value.trim();
      const per = document.getElementById('lead-time'); const periodo = per.options[per.selectedIndex].text;
      const msg = 'Olá, Rafaela! Meu nome é ' + v('lead-name') + '. Tenho interesse no imóvel ${p.ref} (${p.titulo.replace(/'/g, "\\'")}) e gostaria de agendar uma visita. Melhor período para contato: ' + periodo + '. ' + (v('lead-notes') ? 'Mensagem: ' + v('lead-notes') + '. ' : '') + 'Meu WhatsApp: ' + v('lead-phone') + '.';
      window.open('https://wa.me/${WA}?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      document.getElementById('submit-contact-btn').classList.add('hidden');
      document.getElementById('form-success-msg').classList.remove('hidden');
    }
`);
  h = h.replace('id="btn-fav"', `id="btn-fav" data-slug="${p.slug}"`);
  // SEO
  const where = `${p.bairroLabel}, ${p.cidadeLabel}/SP`;
  const title = `${p.curto || p.titulo} – ${p.cidadeLabel}/SP | Rafaela Requi`;
  const desc = `${p.resumo} À venda em ${where}. Valor sob consulta. ${p.ref}. Rafaela Requi, CRECI 217 650-F.`;
  const file = urlOf(p);
  const ld = [{ '@context': 'https://schema.org', '@type': 'Product', name: p.titulo, description: p.resumo, sku: p.ref, image: R.map(x => `${SITE}/assets/${x}`), category: p.tipoLabel, brand: { '@type': 'Organization', name: 'Rafaela Requi Imóveis' }, areaServed: { '@type': 'Place', name: `${p.cidadeLabel}, SP` } }, crumbs([['Início', ''], ['Imóveis', 'imoveis.html'], [p.titulo, file]])];
  h = setHead(h, { title, desc: desc.slice(0, 158), file, img: R[0], ld, type: 'product' });
  return common(h);
}

// ---------- listagem ----------
function listing() {
  let h = rd('imoveis.html');
  h = h.replace(/(<a [^>]*)href="#">Início<\/a>/, '$1href="index.html">Início</a>');
  const uniq = k => new Set(props.map(p => p[k])).size;
  const [a, aside, b] = cut(h, '<aside', '</aside>');
  let f = aside.replace(/ checked=""/g, '').replace(/ selected=""/g, '');
  const drop = (from, to) => { f = replaceBetween(f, from, to, ''); };
  if (uniq('finalidade') < 2) drop('<!-- Finalidade', '<!-- Tipo de Imóvel');
  if (uniq('tipo') < 2) drop('<!-- Tipo de Imóvel', '<!-- Cidade');
  if (uniq('cidade') < 2) drop('<!-- Cidade', '<!-- Bairros');
  if (!hasPrice) drop('<!-- Faixa de Preço', '<!-- Quartos');
  drop('<!-- Área Mínima', '<!-- Características');
  f = f.replace('<option selected value="todas">', '<option value="todas">');
  // bairros reais
  const seen = []; for (const p of props) if (!seen.find(x => x.bairro === p.bairro)) seen.push(p);
  f = f.replace(/<select id="filter-neighborhood"[\s\S]*?<\/select>/, m => m.replace(/<option[\s\S]*<\/option>/, '<option value="todos">Todos os Bairros</option>' + seen.map(p => `<option value="${p.bairro}">${esc(p.bairroLabel)}</option>`).join('')));
  f = f.replace('Bairro (Igarapava)', 'Bairro / Condomínio');
  // características reais
  const FL = { piscina: 'Piscina', gourmet: 'Área gourmet', financiamento: 'Aceita financiamento', permuta: 'Aceita permuta' };
  const used = Object.keys(FL).filter(k => props.some(p => p.feats.includes(k)));
  f = replaceBetween(f, '<!-- Características Especiais -->', '<!-- Action Buttons -->', `<!-- Características -->\n<div class="flex flex-col gap-2 pt-1"><span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Características</span><div class="flex flex-col gap-1.5 font-body-md text-body-md text-on-surface">${used.map(k => `<label class="flex items-center gap-2 cursor-pointer"><input class="w-4 h-4 rounded text-primary focus:ring-primary accent-[#c49a5a]" data-feat="${k}" type="checkbox"/><span>${FL[k]}</span></label>`).join('')}</div></div>\n`);
  h = a + f + b;
  if (!hasPrice) h = h.replace(/<option value="price-asc">[^<]*<\/option>\s*<option value="price-desc">[^<]*<\/option>/, '').replace(/<option value="area">[^<]*<\/option>/, '');
  // cards
  const start = h.indexOf('<!-- Card 1'), end = h.indexOf('<!-- Elegant Pagination'); must(start > 0 && end > start, 'cards');
  const gridOpen = h.lastIndexOf('<div', start);
  const gridTag = h.slice(gridOpen, start).replace(/^<div/, '<div id="catalog-grid"');
  h = h.slice(0, gridOpen) + gridTag + props.map(cardListing).join('\n') +
    `<div id="empty-state" class="hidden col-span-full bg-surface-container-low rounded-xl p-8 text-center flex flex-col items-center gap-3"><span class="material-symbols-outlined text-primary text-[36px]">search_off</span><h3 class="font-headline-sm text-headline-sm text-on-surface">Nenhum imóvel com esses filtros</h3><p class="font-body-md text-body-md text-on-surface-variant max-w-md">Tente ampliar a busca ou conte para a Rafaela o que você procura — ela faz a busca ativa na região.</p><a class="inline-flex items-center gap-2 bg-primary-container text-on-primary-container font-label-md text-label-md px-5 py-2.5 rounded-lg font-semibold" href="${waLink('Olá, Rafaela! Não encontrei no site o imóvel que procuro e gostaria de ajuda.')}" target="_blank" rel="noopener noreferrer">Falar com a Rafaela</a></div></div>\n` + h.slice(end);
  h = replaceBetween(h, '<!-- Elegant Pagination', '<!-- VIP Concierge', '');
  h = replaceBetween(h, '<!-- Active Filter Tags', '<!-- Property Cards Grid', '<div id="active-filters" class="flex flex-wrap items-center gap-2 mb-4"></div>\n');
  h = h.replace(/<!-- Interactive Script for Micro-Interactions -->\s*<script>[\s\S]*?<\/script>/, '');
  h = h.replace('Exibindo 24 imóveis encontrados', `Exibindo ${props.length} imóveis`);
  h = h.replace('<h1', '<h1 id="page-h1"');
  const ld = [{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Imóveis à venda em Igarapava e região', itemListElement: props.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/${urlOf(p)}`, name: p.titulo })) }, crumbs([['Início', ''], ['Imóveis', 'imoveis.html']])];
  h = setHead(h, { title: 'Imóveis à Venda em Igarapava e Região | Rafaela Requi', desc: 'Casas à venda em Igarapava: Porto Feliz, Vila Marilene, Jardim Portinari, Kazuto Yatsuda e Condomínio Náutico Águas da Ribalta. Rafaela Requi, CRECI 217 650-F.', file: 'imoveis.html', img: props[0].real[0], ld });
  return common(h);
}

// ---------- home ----------
function home() {
  let h = rd('index.html');
  const arts = h.match(/<article[\s\S]*?<\/article>/g); must(arts.length === 9, '9 articles');
  props.slice(0, 6).forEach((p, i) => { h = h.replace(arts[i], cardHome(p)); });
  blog.slice(0, 3).forEach((b, i) => {
    let n = arts[6 + i].replace('<article class="', '<article class="relative ').replace(/<img /, `<img alt="${esc(b.titulo)}" loading="lazy" `).replace(/<span class="text-primary font-semibold">Ler artigo →<\/span>/, `<a class="text-primary font-semibold after:absolute after:inset-0" href="${b.file}">Ler artigo →</a>`);
    h = h.replace(arts[6 + i], n);
  });
  { const k = h.indexOf('O que dizem os clientes'); const a0 = h.lastIndexOf('<section', k), b0 = h.indexOf('</section>', k) + 10; must(k > 0, 'depoimentos'); h = h.slice(0, a0) + reviewsSection() + h.slice(b0); }
  { const a = h.indexOf('1. HERO SECTION'); must(a > 0, 'hero'); h = h.slice(0, a) + h.slice(a).replace("assets/img-53ac80c5ca.jpg", "assets/hero.jpg"); }
  const catMap = { Casas: 'tipo=casa', Apartamentos: 'tipo=apartamento', Terrenos: 'tipo=terreno', 'Chácaras': 'tipo=chacara', Comercial: 'tipo=comercial' };
  h = h.replace(/<a data-path="imoveis" href="imoveis.html">([\s\S]*?)<\/a>/g, (m, inner) => {
    const t = (inner.match(/<h3[^>]*>([^<]*)<\/h3>/) || [])[1]; if (!t) return m;
    const q = Object.entries(catMap).find(([k]) => t.includes(k)); const qq = q ? q[1] : /Rifaina|Rancho/i.test(t) ? 'cidade=rifaina' : null;
    return qq ? m.replace('href="imoveis.html"', `href="imoveis.html?${qq}"`) : m;
  });
  const [x, formHtml, z] = cut(h, '<form', '</form>');
  let n = 0; const names = ['tipo', 'local', 'preco', 'quartos'];
  const form = formHtml.replace(/onsubmit="[^"]*"/, 'id="home-search"').replace(/<select/g, () => `<select name="${names[n++] || 'x'}"`);
  h = x + form + z;
  { // última seção: foto de fundo + tela escura com tom dourado
    const a0 = h.indexOf('<section class="w-full bg-surface-container-high py-20">'); must(a0 > 0, 'ultima secao');
    const b0 = h.indexOf('</section>', a0) + 10;
    let sec = h.slice(a0, b0)
      .replace('<section class="w-full bg-surface-container-high py-20">', '<section id="chamada-final" class="relative w-full overflow-hidden py-28 lg:py-32 isolate" style="clip-path:inset(0);background:#140d04"><div class="fixed top-0 left-0 w-screen h-screen -z-20 overflow-hidden isolate pointer-events-none" aria-hidden="true"><img alt="" loading="lazy" class="absolute inset-0 w-full h-full object-cover" style="filter:brightness(.5)" src="assets/rodape.jpg"/><div class="absolute inset-0" style="background:linear-gradient(180deg,rgba(14,9,3,.76) 0%,rgba(20,13,4,.70) 50%,rgba(14,9,3,.82) 100%)"></div><div class="absolute inset-0 mix-blend-multiply" style="background:rgba(196,154,90,.38)"></div></div>')
      .replace('text-primary">Inicie', 'text-primary-fixed">Inicie')
      .replace('bg-primary hover:bg-primary-container text-on-primary', 'bg-primary-container hover:bg-primary-fixed text-on-primary-container')
      .replace('text-on-surface mt-2 mb-4', 'text-white mt-2 mb-4')
      .replace('text-secondary max-w-2xl mx-auto mb-8', 'text-white/85 max-w-2xl mx-auto mb-8');
    h = h.slice(0, a0) + sec + h.slice(b0);
  }
  h = h.replace('<h1', '<h1 id="page-h1"');
  const ld = [{ '@context': 'https://schema.org', '@type': 'RealEstateAgent', name: 'Rafaela Requi – Corretora e Avaliadora de Imóveis', url: SITE + '/', image: `${SITE}/assets/${props[0].real[0]}`, logo: `${SITE}/assets/logo_rafaela_preta.svg`, telephone: '+55 16 99460-2780', email: 'contato@rafaelarequiimoveis.com.br', identifier: 'CRECI 217 650-F', address: { '@type': 'PostalAddress', addressLocality: 'Igarapava', addressRegion: 'SP', addressCountry: 'BR' }, areaServed: ['Igarapava', 'Rifaina', 'Buritizal', 'Aramina', 'Pedregulho'].map(c => ({ '@type': 'City', name: c })), openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' }, { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '12:00' }] },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Rafaela Requi Imóveis', url: SITE + '/' }];
  h = setHead(h, { title: 'Rafaela Requi – Corretora e Avaliadora de Imóveis em Igarapava', desc: 'Compre, venda ou alugue imóveis em Igarapava, Rifaina e região com atendimento direto e avaliação técnica. Rafaela Requi, corretora e avaliadora, CRECI 217 650-F.', file: 'index.html', img: props[0].real[0], ld });
  return common(h);
}

// ---------- avaliação ----------
function avaliacao() {
  let h = rd('avaliacao.html');
  h = h.replace(/onsubmit="event\.preventDefault\(\); document\.getElementById\('formSuccess'\)[^"]*"/, 'onsubmit="submitEvaluation(event)"');
  h = h.replace('<h1', '<h1 id="page-h1"');
  const ld = [{ '@context': 'https://schema.org', '@type': 'Service', name: 'Avaliação de imóveis (PTAM)', serviceType: 'Avaliação imobiliária', provider: { '@type': 'RealEstateAgent', name: 'Rafaela Requi – Corretora e Avaliadora de Imóveis', telephone: '+55 16 99460-2780' }, areaServed: 'Igarapava e região, SP' }, crumbs([['Início', ''], ['Avaliação de Imóveis', 'avaliacao.html']])];
  h = setHead(h, { title: 'Avaliação de Imóveis em Igarapava (PTAM) | Rafaela Requi', desc: 'Parecer Técnico de Avaliação Mercadológica para venda, inventário, partilha, garantia bancária e processos. Avaliação de imóveis em Igarapava e região com Rafaela Requi.', file: 'avaliacao.html', ld });
  return common(h);
}

// ---------- páginas simples (blog e legais) ----------
function shell(mainHtml, seo, flush) {
  let h = rd('index.html');
  const i = h.indexOf('<main'), j = h.indexOf('</main>');
  must(i > 0 && j > i, 'main');
  h = h.slice(0, i) + `<main class="pt-[140px] ${flush ? 'pb-0' : 'pb-20'} bg-surface">${mainHtml}</main>` + h.slice(j + 7);
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  return common(setHead(h, seo));
}
const prose = (inner) => `<div class="max-w-3xl mx-auto px-margin-mobile lg:px-margin">${inner}</div>`;
const H2 = 'font-headline-sm text-headline-sm text-on-surface mt-8 mb-2';
const P = 'font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-4';

function articlePage(b) {
  const body = b.sections.map(s => `<h2 class="${H2}">${esc(s.h)}</h2>${(s.p || []).map(t => `<p class="${P}">${t}</p>`).join('')}${s.ul ? `<ul class="list-disc pl-6 mb-4 text-on-surface-variant font-body-lg text-body-lg leading-relaxed flex flex-col gap-1.5">${s.ul.map(li => `<li>${li}</li>`).join('')}</ul>` : ''}`).join('');
  const html = prose(`<nav aria-label="Breadcrumb" class="font-label-md text-label-md text-on-surface-variant mb-6"><a class="hover:text-primary" href="index.html">Início</a> / <a class="hover:text-primary" href="blog.html">Blog</a> / <span class="text-primary">${esc(b.tag)}</span></nav>
<span class="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">${esc(b.tag)} • ${b.min} min de leitura</span>
<h1 class="font-headline-lg text-headline-lg text-on-surface mt-2 mb-4">${esc(b.titulo)}</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant mb-6">${esc(b.lead)}</p>
<img alt="${esc(b.titulo)}" class="w-full aspect-[16/9] object-cover rounded-xl mb-8" src="assets/${b.img}"/>
${body}
<div class="mt-10 bg-inverse-surface text-inverse-on-surface rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"><div><p class="font-title-md text-white font-semibold">${esc(b.cta)}</p><p class="font-body-md text-secondary-fixed">Rafaela Requi • CRECI 217 650-F</p></div><a class="shrink-0 bg-primary-container text-on-primary-container font-label-md text-label-md px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all" href="${waLink(b.wa)}" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a></div>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-6">Conteúdo informativo de caráter geral. Cada caso exige análise da documentação específica.</p>`);
  const ld = [{ '@context': 'https://schema.org', '@type': 'Article', headline: b.titulo, description: b.lead, image: `${SITE}/assets/${b.img}`, datePublished: '2026-11-10', dateModified: '2026-11-10', author: { '@type': 'Person', name: 'Rafaela Requi', jobTitle: 'Corretora e Avaliadora de Imóveis' }, publisher: { '@type': 'Organization', name: 'Rafaela Requi Imóveis', logo: { '@type': 'ImageObject', url: `${SITE}/assets/logo_rafaela_preta.svg` } }, mainEntityOfPage: `${SITE}/${b.file}` }, crumbs([['Início', ''], ['Blog', 'blog.html'], [b.titulo, b.file]])];
  return shell(html, { title: `${b.titulo} | Rafaela Requi`, desc: b.lead.slice(0, 158), file: b.file, img: b.img, ld, type: 'article' });
}
function legalPage(file, title, secs) {
  const html = prose(`<h1 class="font-headline-lg text-headline-lg text-on-surface mb-6">${title}</h1><p class="font-label-sm text-label-sm text-on-surface-variant mb-6">Última atualização: 10 de novembro de 2026</p>${secs.map(s => `<h2 class="${H2}">${s[0]}</h2><p class="${P}">${s[1]}</p>`).join('')}`);
  return shell(html, { title: `${title} | Rafaela Requi Imóveis`, desc: `${title} do site Rafaela Requi – Corretora e Avaliadora de Imóveis (CRECI 217 650-F).`, file });
}

// ---------- gerar ----------
const pages = {};
pages['index.html'] = home();
pages['imoveis.html'] = listing();
pages['avaliacao.html'] = avaliacao();
pages['sobre.html'] = shell(paginas.sobre(), { title: 'Sobre Rafaela Requi – Corretora e Avaliadora de Imóveis em Igarapava', desc: 'Conheça a Rafaela Requi, corretora e perita avaliadora de imóveis em Igarapava e região (CRECI 217 650-F): atendimento próximo, avaliação técnica e segurança jurídica.', file: 'sobre.html', img: 'rafaela.jpg', ld: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Sobre Rafaela Requi', url: SITE + '/sobre.html', mainEntity: { '@type': 'Person', name: 'Rafaela Requi', jobTitle: 'Corretora e Avaliadora de Imóveis', identifier: 'CRECI 217 650-F', image: SITE + '/assets/rafaela.jpg', worksFor: { '@type': 'RealEstateAgent', name: 'Rafaela Requi Imóveis' }, address: { '@type': 'PostalAddress', addressLocality: 'Igarapava', addressRegion: 'SP', addressCountry: 'BR' } } }, crumbs([['Início', ''], ['Sobre', 'sobre.html']])] }, true);
pages['blog.html'] = shell(paginas.blogIndex(blog), { title: 'Blog: Dicas e Mercado Imobiliário em Igarapava | Rafaela Requi', desc: 'Artigos sobre compra, venda, avaliação de imóveis e o mercado regional de Igarapava, Rifaina e Alta Mogiana, por Rafaela Requi, corretora e avaliadora.', file: 'blog.html', img: blog[0].img, ld: [{ '@context': 'https://schema.org', '@type': 'Blog', name: 'Dicas & Mercado Regional – Rafaela Requi', url: SITE + '/blog.html', blogPost: blog.map(b => ({ '@type': 'BlogPosting', headline: b.titulo, url: SITE + '/' + b.file })) }, crumbs([['Início', ''], ['Blog', 'blog.html']])] });
pages['contato.html'] = shell(paginas.contato(), { title: 'Contato | Rafaela Requi – Corretora de Imóveis em Igarapava', desc: 'Fale com a Rafaela Requi pelo WhatsApp (16) 99460-2780, telefone ou formulário. Atendimento em Igarapava e região, de segunda a sábado.', file: 'contato.html', img: props[0].real[0], ld: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contato – Rafaela Requi Imóveis', url: SITE + '/contato.html' }, crumbs([['Início', ''], ['Contato', 'contato.html']])] });
pages['financiamento.html'] = shell(financiamentoMain(), { title: 'Simulador de Financiamento Imobiliário | Rafaela Requi', desc: 'Simule o financiamento do seu imóvel: parcelas SAC ou Price, total de juros e renda recomendada. Atendimento em Igarapava e região com Rafaela Requi, CRECI 217 650-F.', file: 'financiamento.html', img: props[0].real[0], ld: [crumbs([['Início', ''], ['Financiamento', 'financiamento.html']])] });
for (const p of props) pages[urlOf(p)] = detail(p);
for (const b of blog) pages[b.file] = articlePage(b);
pages['politica-de-privacidade.html'] = legalPage('politica-de-privacidade.html', 'Política de Privacidade', [
  ['Quem somos', 'Este site é mantido por Rafaela Requi – Corretora e Avaliadora de Imóveis (CRECI 217 650-F), com atuação em Igarapava e região (SP). Contato: contato@rafaelarequiimoveis.com.br.'],
  ['Quais dados coletamos', 'Coletamos apenas os dados que você informa nos formulários do site (nome, telefone, e-mail, cidade/bairro do imóvel e mensagem). Ao enviar um formulário, esses dados são montados em uma mensagem de WhatsApp enviada diretamente à corretora; o site não armazena esses dados em servidor próprio.'],
  ['Para que usamos', 'Usamos os dados exclusivamente para responder ao seu contato, agendar visitas, apresentar propostas de avaliação e acompanhar a negociação de imóveis.'],
  ['Favoritos e armazenamento local', 'Os imóveis que você marca como favoritos ficam salvos apenas no seu navegador (armazenamento local) e não são enviados a nós.'],
  ['Compartilhamento', 'Não vendemos dados pessoais. Podemos compartilhá-los com cartórios, instituições financeiras e demais partes envolvidas na negociação, somente quando necessário e com o seu conhecimento.'],
  ['Seus direitos (LGPD)', 'Nos termos da Lei nº 13.709/2018, você pode solicitar confirmação de tratamento, acesso, correção, anonimização ou exclusão dos seus dados pelo e-mail contato@rafaelarequiimoveis.com.br.'],
]);
pages['termos-de-uso.html'] = legalPage('termos-de-uso.html', 'Termos de Uso', [
  ['Informações dos imóveis', 'Os imóveis, valores, medidas e condições exibidos neste site têm caráter informativo e podem ser alterados ou retirados sem aviso prévio. As informações não constituem oferta vinculante; confirme disponibilidade, valores e documentação com a corretora.'],
  ['Imagens', 'As imagens são ilustrativas e podem não refletir o estado atual do imóvel. Solicite fotos atualizadas e agende uma visita antes de qualquer decisão.'],
  ['Simulações', 'As simulações de financiamento são estimativas referenciais. Taxas, prazos e aprovação dependem da análise de crédito da instituição financeira.'],
  ['Avaliações', 'A solicitação de avaliação pelo formulário não gera obrigação até a aceitação da proposta técnica e dos honorários pelas partes.'],
  ['Propriedade intelectual', 'Textos, marca, logotipo e imagens deste site pertencem à Rafaela Requi Imóveis ou são utilizados com autorização, sendo proibida a reprodução sem permissão.'],
  ['Contato', 'Dúvidas sobre estes termos: contato@rafaelarequiimoveis.com.br.'],
]);
for (const [f, c] of Object.entries(pages)) wr(f, c);

// sitemap + robots
const urls = Object.keys(pages).map(f => `${SITE}/${f === 'index.html' ? '' : f}`);
wr('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc><lastmod>2026-11-10</lastmod></url>`).join('\n')}\n</urlset>\n`);
wr('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(Object.keys(pages).length, 'páginas geradas em site/');
