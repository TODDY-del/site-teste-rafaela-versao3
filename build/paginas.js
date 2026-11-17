// Páginas: Sobre, Blog (índice) e Contato. Cada função devolve o HTML do <main>.
const WA = '5516994602780';
const wa = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const WAI = c => `<svg class="${c}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zM20.52 3.45A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.4z"/></svg>`;

const wrap = 'max-w-[1280px] mx-auto px-margin-mobile lg:px-margin';
const eyebrow = 'font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold';
const btnPrimary = 'inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-md text-label-md font-semibold shadow-sm transition-all';
const btnGhost = 'inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border-[1.5px] border-primary text-primary hover:bg-primary/10 font-label-md text-label-md font-semibold transition-all';
const crumb = (n) => `<nav aria-label="Breadcrumb" class="font-label-md text-label-md text-on-surface-variant mb-6"><a class="hover:text-primary" href="index.html">Início</a> / <span class="text-primary">${n}</span></nav>`;


// Última seção no mesmo padrão da home: foto fixa ao fundo + tela escura com tom dourado
function ctaFundo({ eyebrow, titulo, texto, sec, waMsg }) {
  return `<section class="relative w-full overflow-hidden py-28 lg:py-32 isolate mt-24" style="clip-path:inset(0);background:#140d04"><div class="fixed top-0 left-0 w-screen h-screen -z-20 overflow-hidden isolate pointer-events-none" aria-hidden="true"><img alt="" loading="lazy" class="absolute inset-0 w-full h-full object-cover" style="filter:brightness(.5)" src="assets/rodape.jpg"/><div class="absolute inset-0" style="background:linear-gradient(180deg,rgba(14,9,3,.76) 0%,rgba(20,13,4,.70) 50%,rgba(14,9,3,.82) 100%)"></div><div class="absolute inset-0 mix-blend-multiply" style="background:rgba(196,154,90,.38)"></div></div>
<div class="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin text-center">
<span class="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">${eyebrow}</span>
<h2 class="font-display text-headline-lg lg:text-display text-white mt-2 mb-4 tracking-tight max-w-3xl mx-auto">${titulo}</h2>
<p class="font-body-lg text-body-lg text-white/85 max-w-2xl mx-auto mb-8">${texto}</p>
<div class="flex flex-wrap items-center justify-center gap-4">
<a class="px-8 py-3.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface font-label-md text-label-md shadow-sm transition-all" href="${sec[1]}">${sec[0]}</a>
<a class="px-8 py-3.5 rounded-lg bg-primary-container hover:bg-primary-fixed text-on-primary-container font-label-md text-label-md flex items-center gap-2 shadow-sm transition-all" href="${wa(waMsg)}" rel="noopener noreferrer" target="_blank">${WAI('w-5 h-5')}<span>Falar no WhatsApp (16) 99460-2780</span></a>
</div></div></section>`;
}

// ---------------- SOBRE ----------------
function sobre() {
  const valores = [
    ['support_agent', 'Atendimento personalizado', 'Ouço o que você realmente precisa, sem pressão comercial. Cada família e cada investidor tem seu tempo e seus critérios.'],
    ['fact_check', 'Avaliação técnica', 'Como avaliadora, apoio cada decisão em dados de mercado, para que você não pague a mais nem venda por menos.'],
    ['explore', 'Conhecimento regional', 'Vivência diária em Igarapava e na região dos lagos do Rio Grande: conheço bairros, valores e oportunidades.'],
    ['gavel', 'Segurança jurídica', 'Cuido da conferência documental, das certidões e dos contratos, do primeiro contato até o pós-entrega das chaves.'],
  ];
  const regioes = ['Igarapava', 'Rifaina', 'Pedregulho', 'Aramina', 'Buritizal'];
  return `
<section class="${wrap}">
  ${crumb('Sobre')}
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
    <div class="lg:col-span-7 order-2 lg:order-1">
      <span class="${eyebrow}">Atendimento próximo &amp; humanizado</span>
      <h1 class="font-headline-lg text-headline-lg lg:text-display text-on-surface mt-2 tracking-tight">Olá, sou a Rafaela Requi. Prazer em receber você!</h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant mt-5 leading-relaxed">Com raízes profundas em Igarapava e vivência diária em toda a região dos lagos do Rio Grande, minha missão vai além de abrir portas e redigir contratos. Atuo como conselheira e parceira de confiança para proteger o seu patrimônio financeiro e honrar a história da sua família.</p>
      <p class="font-body-lg text-body-lg text-on-surface-variant mt-4 leading-relaxed">Como corretora e perita avaliadora de imóveis, trago o olhar técnico e mercadológico necessário para que você nunca pague a mais ao comprar, nem venda por menos do que seu bem realmente vale.</p>
      <blockquote class="mt-6 border-l-4 border-primary-container pl-5 font-headline-sm text-headline-sm text-on-surface italic">“Mais do que transações imobiliárias, construímos relações de confiança para a vida toda.”</blockquote>
      <div class="mt-8 flex flex-wrap gap-3">
        <a class="${btnPrimary}" href="${wa('Olá, Rafaela! Vim pelo site e gostaria de conversar.')}" target="_blank" rel="noopener noreferrer">${WAI('w-5 h-5')}<span>Conversar com a Rafaela</span></a>
        <a class="${btnGhost}" href="imoveis.html"><span>Ver imóveis</span><span class="material-symbols-outlined text-[18px]">arrow_forward</span></a>
      </div>
    </div>
    <div class="lg:col-span-5 order-1 lg:order-2 relative max-w-md mx-auto w-full">
      <div class="absolute -bottom-4 -right-4 w-full h-full rounded-2xl bg-primary-container/40" aria-hidden="true"></div>
      <img alt="Rafaela Requi – Corretora e Avaliadora de Imóveis em Igarapava" class="relative w-full aspect-[3/4] object-cover object-top rounded-2xl shadow-lg" src="assets/rafaela.jpg"/>
      <div class="absolute left-4 bottom-4 right-4 bg-inverse-surface/90 backdrop-blur-md text-white rounded-xl px-4 py-3 flex items-center gap-3"><span class="material-symbols-outlined text-primary-fixed text-[26px]">verified</span><div class="flex flex-col"><span class="font-label-md text-label-md font-semibold tracking-wide">CRECI 217 650-F</span><span class="font-label-sm text-label-sm opacity-80">Corretora &amp; Avaliadora de Imóveis</span></div></div>
    </div>
  </div>
</section>

<section class="${wrap} mt-24">
  <div class="text-center max-w-2xl mx-auto"><span class="${eyebrow}">Como eu trabalho</span><h2 class="font-headline-lg text-headline-lg text-on-surface mt-2">O que guia cada negociação</h2></div>
  <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
    ${valores.map(([ic, t, d]) => `<div class="bg-surface-container-low rounded-2xl p-6"><span class="material-symbols-outlined text-primary text-[30px]">${ic}</span><h3 class="font-headline-sm text-headline-sm text-on-surface mt-3">${t}</h3><p class="font-body-md text-body-md text-on-surface-variant mt-2">${d}</p></div>`).join('')}
  </div>
</section>

<section class="${wrap} mt-24">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
    <div class="bg-surface-container-low rounded-2xl p-8">
      <div class="flex items-center gap-2 text-primary"><span class="material-symbols-outlined text-[26px]">workspace_premium</span><h2 class="font-headline-sm text-headline-sm text-on-surface">Credenciais</h2></div>
      <ul class="mt-5 flex flex-col gap-3 font-body-lg text-body-lg text-on-surface-variant">
        <li class="flex gap-3"><span class="material-symbols-outlined text-tertiary">check_circle</span><span><strong class="text-on-surface">CRECI 217 650-F</strong> — corretora de imóveis registrada.</span></li>
        <li class="flex gap-3"><span class="material-symbols-outlined text-tertiary">check_circle</span><span><strong class="text-on-surface">Perita avaliadora imobiliária</strong> — elaboração de Parecer Técnico de Avaliação Mercadológica (PTAM).</span></li>
        <li class="flex gap-3"><span class="material-symbols-outlined text-tertiary">check_circle</span><span><strong class="text-on-surface">CNAI</strong> — Cadastro Nacional de Avaliadores Imobiliários.</span></li>
      </ul>
    </div>
    <div class="bg-surface-container-low rounded-2xl p-8">
      <div class="flex items-center gap-2 text-primary"><span class="material-symbols-outlined text-[26px]">location_on</span><h2 class="font-headline-sm text-headline-sm text-on-surface">Onde eu atuo</h2></div>
      <p class="font-body-lg text-body-lg text-on-surface-variant mt-4">Atendimento presencial em Igarapava – SP e visitas agendadas em toda a região dos lagos do Rio Grande.</p>
      <div class="mt-5 flex flex-wrap gap-2">${regioes.map(r => `<a href="imoveis.html" class="px-4 py-2 rounded-full bg-surface-container border border-primary/30 font-label-md text-label-md text-on-surface hover:border-primary transition-colors">${r} – SP</a>`).join('')}</div>
    </div>
  </div>
</section>

${ctaFundo({ eyebrow: 'Inicie seu próximo passo', titulo: 'Vamos conversar sobre o seu próximo passo?', texto: 'Seja para comprar, vender ou avaliar um imóvel, o primeiro atendimento é sem compromisso.', sec: ['Outras formas de contato', 'contato.html'], waMsg: 'Olá, Rafaela! Vim pelo site e gostaria de conversar.' })}`;
}

// ---------------- BLOG (índice) ----------------
function blogIndex(blog) {
  const cards = blog.map(b => `<article class="relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
<div class="aspect-[16/10] overflow-hidden bg-surface-container"><img alt="${esc(b.titulo)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="assets/${b.img}"/></div>
<div class="p-6 flex flex-col flex-1"><span class="${eyebrow} !text-[11px]">${esc(b.tag)}</span>
<h2 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mt-2"><a class="after:absolute after:inset-0" href="${b.file}">${esc(b.titulo)}</a></h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-3">${esc(b.lead)}</p>
<div class="mt-auto pt-4 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant border-t border-outline-variant/40 mt-5"><span>${b.min} min de leitura</span><span class="text-primary font-semibold">Ler artigo →</span></div></div></article>`).join('\n');
  return `
<section class="${wrap}">
  ${crumb('Blog')}
  <span class="${eyebrow}">Conteúdo educativo</span>
  <h1 class="font-headline-lg text-headline-lg lg:text-display text-on-surface mt-2 tracking-tight">Dicas &amp; Mercado Regional</h1>
  <p class="font-body-lg text-body-lg text-on-surface-variant mt-3 max-w-3xl">Artigos para ajudar você a tomar decisões conscientes com o seu patrimônio: compra, venda, avaliação e o mercado de Igarapava e região.</p>
  <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">${cards}</div>
  <div class="mt-16 bg-surface-container-low rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
    <div><h2 class="font-headline-sm text-headline-sm text-on-surface">Tem uma dúvida que não está aqui?</h2><p class="font-body-md text-body-md text-on-surface-variant mt-1">Conte para a Rafaela — sua pergunta pode virar o próximo artigo.</p></div>
    <a class="${btnPrimary} shrink-0" href="${wa('Olá, Rafaela! Tenho uma dúvida sobre imóveis e gostaria de ajuda.')}" target="_blank" rel="noopener noreferrer">${WAI('w-5 h-5')}<span>Perguntar no WhatsApp</span></a>
  </div>
</section>`;
}

// ---------------- CONTATO ----------------
function contato() {
  const input = 'w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30';
  const lb = 'font-label-md text-label-md text-on-surface-variant mb-1.5 block';
  const info = [
    ['chat', 'WhatsApp', '(16) 99460-2780', wa('Olá, Rafaela! Vim pelo site e gostaria de conversar.'), true],
    ['call', 'Telefone', '(16) 99460-2780', 'tel:16994602780', false],
    ['mail', 'E-mail', 'contato@rafaelarequiimoveis.com.br', 'mailto:contato@rafaelarequiimoveis.com.br', false],
  ];
  return `
<section class="${wrap}">
  ${crumb('Contato')}
  <span class="${eyebrow}">Fale com a Rafaela</span>
  <h1 class="font-headline-lg text-headline-lg lg:text-display text-on-surface mt-2 tracking-tight">Vamos conversar sobre o seu imóvel</h1>
  <p class="font-body-lg text-body-lg text-on-surface-variant mt-3 max-w-3xl">Escolha o canal que preferir. O atendimento é direto, sem compromisso, e a resposta mais rápida costuma ser pelo WhatsApp.</p>

  <div class="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
    <div class="lg:col-span-5 flex flex-col gap-4">
      ${info.map(([ic, t, v, href, isWa]) => `<a class="group flex items-center gap-4 bg-surface-container-low hover:bg-surface-container rounded-2xl p-5 transition-colors" href="${href}" ${isWa ? 'target="_blank" rel="noopener noreferrer"' : ''}><span class="w-12 h-12 rounded-full ${isWa ? 'bg-[#25D366] text-white' : 'bg-primary-container/30 text-primary'} flex items-center justify-center shrink-0">${isWa ? WAI('w-6 h-6') : `<span class="material-symbols-outlined">${ic}</span>`}</span><span class="flex flex-col min-w-0"><span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">${t}</span><span class="font-title-md text-[16px] text-on-surface font-semibold break-words">${v}</span></span></a>`).join('')}
      <div class="flex items-start gap-4 bg-surface-container-low rounded-2xl p-5"><span class="w-12 h-12 rounded-full bg-primary-container/30 text-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined">schedule</span></span><span class="flex flex-col"><span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Horário de atendimento</span><span class="font-body-md text-body-md text-on-surface mt-0.5">Segunda a sexta: 08h às 18h<br/>Sábado: 08h às 12h</span></span></div>
      <div class="flex items-start gap-4 bg-surface-container-low rounded-2xl p-5"><span class="w-12 h-12 rounded-full bg-primary-container/30 text-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined">location_on</span></span><span class="flex flex-col"><span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Onde atendo</span><span class="font-body-md text-body-md text-on-surface mt-0.5">Atendimento presencial em Igarapava – SP e visitas agendadas na região.</span></span></div>
    </div>

    <form id="contact-form" class="lg:col-span-7 bg-surface-container-low rounded-2xl p-6 sm:p-8 flex flex-col gap-5" onsubmit="return submitContact(event)">
      <div class="flex items-center gap-2 text-primary"><span class="material-symbols-outlined text-[24px]">forum</span><h2 class="font-headline-sm text-headline-sm text-on-surface">Envie uma mensagem</h2></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label class="${lb}" for="c-nome">Seu nome *</label><input id="c-nome" required class="${input}" placeholder="Ex: Carlos Eduardo" autocomplete="name"/></div>
        <div><label class="${lb}" for="c-tel">WhatsApp / telefone *</label><input id="c-tel" required type="tel" class="${input}" placeholder="(16) 99999-9999" autocomplete="tel"/></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label class="${lb}" for="c-email">E-mail <span class="font-normal">(opcional)</span></label><input id="c-email" type="email" class="${input}" placeholder="seuemail@exemplo.com" autocomplete="email"/></div>
        <div><label class="${lb}" for="c-assunto">Assunto *</label><select id="c-assunto" required class="${input}"><option value="" disabled selected>Selecione</option><option>Quero comprar um imóvel</option><option>Quero vender / anunciar meu imóvel</option><option>Quero alugar um imóvel</option><option>Quero uma avaliação de imóvel</option><option>Financiamento imobiliário</option><option>Outro assunto</option></select></div>
      </div>
      <div><label class="${lb}" for="c-msg">Mensagem</label><textarea id="c-msg" rows="4" class="${input}" placeholder="Conte um pouco sobre o que você procura..."></textarea></div>
      <button type="submit" class="${btnPrimary} w-full sm:w-auto self-start">${WAI('w-5 h-5')}<span>Enviar pelo WhatsApp</span></button>
      <p id="c-ok" class="hidden font-label-md text-label-md text-tertiary font-semibold">Pronto! Abrimos o WhatsApp com a sua mensagem — é só enviar.</p>
      <p class="font-label-sm text-label-sm text-on-surface-variant">Ao enviar, sua mensagem é aberta no WhatsApp para você enviar à Rafaela. Veja a <a class="underline hover:text-primary" href="politica-de-privacidade.html">Política de Privacidade</a>.</p>
    </form>
  </div>

  <div class="mt-12 rounded-2xl overflow-hidden border border-outline-variant/50 shadow-sm">
    <iframe title="Mapa de Igarapava – SP" class="w-full h-[360px] block" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Igarapava+SP&amp;output=embed"></iframe>
  </div>
</section>
<script>
function submitContact(e){
  e.preventDefault();
  var v=function(i){return document.getElementById(i).value.trim()};
  var msg='Olá, Rafaela! Meu nome é '+v('c-nome')+'.\\nAssunto: '+v('c-assunto')+'.'+(v('c-msg')?'\\nMensagem: '+v('c-msg'):'')+'\\nWhatsApp: '+v('c-tel')+(v('c-email')?'\\nE-mail: '+v('c-email'):'');
  window.open('https://wa.me/${WA}?text='+encodeURIComponent(msg),'_blank','noopener');
  document.getElementById('c-ok').classList.remove('hidden');
  return false;
}
</script>`;
}

module.exports = { sobre, blogIndex, contato };
