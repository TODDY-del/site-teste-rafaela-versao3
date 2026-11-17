// Seção "Avaliações do Google" da home.
// IMPORTANTE: troque os textos abaixo pelas avaliações REAIS do perfil da Rafaela no Google e coloque os links reais.
const CONFIG = {
  // Link para o cliente escrever a avaliação (formato do Google: https://search.google.com/local/writereview?placeid=ID_DO_LOCAL)
  reviewUrl: 'https://www.google.com/search?q=Rafaela+Requi+Corretora+de+Im%C3%B3veis+Igarapava',
  // Link para ver todas as avaliações (perfil da empresa no Google Maps / Google Meu Negócio)
  allUrl: 'https://www.google.com/maps/search/?api=1&query=Rafaela+Requi+Corretora+de+Im%C3%B3veis+Igarapava+SP',
};
const REVIEWS = [
  { nome: 'Mariana & Carlos', quando: 'há 2 meses', cor: '#1a73e8', nota: 5,
    texto: 'Estávamos inseguros quanto ao valor do terreno que herdamos em Igarapava. A Rafaela realizou um laudo técnico irretocável que nos permitiu vender de forma rápida e com valor extremamente justo. Atendimento nota 10.' },
  { nome: 'Roberto Mendonça', quando: 'há 4 meses', cor: '#188038', nota: 5,
    texto: 'Comprei meu rancho em Rifaina com a Rafaela. Ela cuidou de todas as certidões com os órgãos ambientais e cartório. Uma tranquilidade que pouquíssimos corretores conseguem oferecer no mercado.' },
  { nome: 'Dra. Claudia Santos', quando: 'há 5 meses', cor: '#a142f4', nota: 5,
    texto: 'A postura humana da Rafaela me encantou. Ela escutou o que eu precisava para a minha clínica, achou um imóvel ótimo e intermediou com elegância a negociação do aluguel comercial. Recomendo de olhos fechados.' },
];

const G = (s) => `<svg class="shrink-0" width="${s}" height="${s}" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
const stars = (n, size = 18) => Array.from({ length: 5 }, (_, i) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" fill="${i < n ? '#FBBC04' : 'currentColor'}" class="${i < n ? '' : 'opacity-20'}"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`).join('');
const initials = n => n.replace(/[&.]/g, ' ').split(/\s+/).filter(w => w && !/^(dra?|dr)$/i.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

module.exports = function reviewsSection() {
  const avg = REVIEWS.reduce((a, r) => a + r.nota, 0) / REVIEWS.length;
  const cards = REVIEWS.map(r => `<article class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-4 border border-outline-variant/40">
<div class="flex items-center gap-3"><div class="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white text-[17px] shrink-0" style="background:${r.cor}" aria-hidden="true">${initials(r.nome)}</div>
<div class="flex flex-col min-w-0"><span class="font-title-md text-[15px] text-on-surface font-semibold truncate">${esc(r.nome)}</span><span class="font-label-sm text-label-sm text-secondary">${esc(r.quando)} • no Google</span></div>
<span class="ml-auto self-start">${G(20)}</span></div>
<div class="flex items-center gap-0.5" role="img" aria-label="${r.nota} de 5 estrelas">${stars(r.nota)}</div>
<p class="font-body-md text-body-md text-on-surface leading-relaxed">${esc(r.texto)}</p></article>`).join('\n');
  return `<section id="avaliacoes" class="w-full bg-surface-container-low py-20">
<div class="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
<div><span class="font-label-sm text-label-sm uppercase tracking-widest text-primary">Histórias Compartilhadas</span>
<h2 class="font-headline-lg text-headline-lg text-on-surface mt-2 tracking-tight">Avaliações no Google</h2>
<p class="font-body-md text-body-md text-secondary mt-1">O que dizem os clientes que já confiaram na Rafaela.</p></div>
<div class="flex items-center gap-4 bg-surface-container-lowest rounded-2xl px-5 py-4 shadow-sm border border-outline-variant/40 self-start md:self-auto">
${G(34)}
<div class="flex flex-col"><div class="flex items-center gap-2"><span class="font-display text-[34px] leading-none text-on-surface font-semibold">${avg.toFixed(1).replace('.', ',')}</span><span class="flex items-center gap-0.5" role="img" aria-label="Nota ${avg.toFixed(1)} de 5">${stars(Math.round(avg), 20)}</span></div>
<span class="font-label-sm text-label-sm text-secondary mt-1">Avaliações de clientes no Google</span></div></div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
${cards}
</div>
<div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
<a class="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-md text-label-md font-semibold shadow-md hover:shadow-lg transition-all w-full sm:w-auto" href="${CONFIG.reviewUrl}" target="_blank" rel="noopener noreferrer"><span class="w-7 h-7 rounded-full bg-white flex items-center justify-center">${G(18)}</span><span class="text-[15px]">Avaliar no Google</span><span class="flex items-center gap-0.5">${stars(5, 16)}</span></a>
<a class="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border-[1.5px] border-primary text-primary hover:bg-primary/10 font-label-md text-label-md font-semibold transition-all w-full sm:w-auto" href="${CONFIG.allUrl}" target="_blank" rel="noopener noreferrer"><span>Ver todas as avaliações</span><span class="material-symbols-outlined text-[18px]">open_in_new</span></a>
</div>
</div></section>`;
};
