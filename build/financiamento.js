// Página "Financiamento": simulador (SAC e Price) + explicações. Retorna o HTML do <main>.
const WA = '5516994602780';
const FAQ = [
  ['Qual a diferença entre SAC e Price?', 'No <strong>SAC</strong> a amortização é constante: a primeira parcela é maior e vai diminuindo ao longo do tempo, e o total de juros pagos costuma ser menor. Na <strong>Tabela Price</strong> as parcelas são fixas (iguais) do início ao fim, o que facilita o planejamento mensal, mas o total pago tende a ser maior.'],
  ['Quanto preciso dar de entrada?', 'Em geral, os bancos financiam uma parte do valor de avaliação do imóvel e o comprador entra com o restante (a entrada). O percentual financiável varia conforme o banco, a modalidade e o seu perfil — por isso a simulação é um ponto de partida, não uma aprovação.'],
  ['Posso usar o FGTS?', 'Em muitos casos o FGTS pode ser usado na entrada, na amortização ou para reduzir parcelas, desde que o comprador e o imóvel atendam às regras do programa. A Rafaela te orienta sobre o que se aplica ao seu caso.'],
  ['Os valores da simulação são definitivos?', 'Não. A simulação é uma <strong>estimativa</strong> com a taxa que você informar. Taxa de juros, TR, seguros, tarifas e a própria aprovação dependem da instituição financeira, da sua renda e da análise de crédito.'],
  ['Que documentos costumam ser pedidos?', 'Normalmente: documento de identidade e CPF, comprovante de estado civil, comprovante de residência, comprovante de renda e, do imóvel, a matrícula atualizada e a documentação do vendedor. A Rafaela ajuda a organizar tudo antes de enviar ao banco.'],
];

const input = 'w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30';
const label = 'font-label-md text-label-md text-on-surface-variant mb-1.5 block';

module.exports = function financiamentoMain() {
  const faqHtml = FAQ.map(([q, a]) => `<details class="group bg-surface-container-lowest rounded-xl border border-outline-variant/40 px-5 py-4"><summary class="flex items-center justify-between gap-4 cursor-pointer list-none font-title-md text-[16px] text-on-surface font-semibold">${q}<span class="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span></summary><p class="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">${a}</p></details>`).join('');
  return `
<section class="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
  <nav aria-label="Breadcrumb" class="font-label-md text-label-md text-on-surface-variant mb-6"><a class="hover:text-primary" href="index.html">Início</a> / <span class="text-primary">Financiamento</span></nav>
  <span class="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">Planeje a compra do seu imóvel</span>
  <h1 class="font-headline-lg text-headline-lg lg:text-display text-on-surface mt-2 tracking-tight">Simulador de Financiamento Imobiliário</h1>
  <p class="font-body-lg text-body-lg text-on-surface-variant mt-3 max-w-3xl">Descubra o valor aproximado das parcelas, o total de juros e a renda recomendada antes de visitar o imóvel. Ajuste os campos e veja o resultado na hora.</p>
</section>

<section class="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin mt-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
  <!-- Formulário -->
  <form id="sim-form" class="lg:col-span-7 bg-surface-container-low rounded-2xl p-6 sm:p-8 flex flex-col gap-6" autocomplete="off" onsubmit="return false">
    <div class="flex items-center gap-2 text-primary"><span class="material-symbols-outlined text-[24px]">calculate</span><h2 class="font-headline-sm text-headline-sm text-on-surface">Dados da simulação</h2></div>

    <div><label class="${label}" for="f-valor">Valor do imóvel</label>
      <div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">R$</span><input id="f-valor" inputmode="numeric" class="${input} pl-12" value="400.000"/></div></div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div><label class="${label}" for="f-entrada">Valor da entrada</label>
        <div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">R$</span><input id="f-entrada" inputmode="numeric" class="${input} pl-12" value="80.000"/></div></div>
      <div><div class="flex items-center justify-between"><label class="${label}" for="f-pct">Entrada (%)</label><span id="o-pct" class="font-label-md text-label-md text-primary font-semibold mb-1.5">20%</span></div>
        <input id="f-pct" type="range" min="0" max="90" step="1" value="20" class="w-full mt-3"/></div>
    </div>
    <p id="w-entrada" class="hidden font-label-md text-label-md text-error -mt-3"></p>

    <div><div class="flex items-center justify-between"><label class="${label}" for="f-prazo">Prazo do financiamento</label><span id="o-prazo" class="font-label-md text-label-md text-primary font-semibold mb-1.5">30 anos (360 meses)</span></div>
      <input id="f-prazo" type="range" min="5" max="35" step="1" value="30" class="w-full mt-2"/>
      <div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant mt-1"><span>5 anos</span><span>20 anos</span><span>35 anos</span></div></div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div><label class="${label}" for="f-taxa">Taxa de juros (% ao ano)</label><div class="relative"><input id="f-taxa" inputmode="decimal" class="${input} pr-12" value="11,00"/><span class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">%</span></div>
        <p class="font-label-sm text-label-sm text-on-surface-variant mt-1.5">Use a taxa informada pelo seu banco. Valor inicial apenas de referência.</p></div>
      <div><label class="${label}" for="f-renda">Renda mensal familiar <span class="font-normal">(opcional)</span></label>
        <div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">R$</span><input id="f-renda" inputmode="numeric" class="${input} pl-12" placeholder="Ex: 9.000"/></div>
        <p class="font-label-sm text-label-sm text-on-surface-variant mt-1.5">Para checar se a parcela cabe no orçamento.</p></div>
    </div>

    <div><span class="${label}">Sistema de amortização</span>
      <div class="grid grid-cols-2 gap-2 p-1 bg-surface-container rounded-xl" role="group" aria-label="Sistema de amortização">
        <button type="button" data-sis="sac" aria-pressed="true" class="sis-btn px-4 py-3 rounded-lg font-label-md text-label-md font-semibold transition-all"><span class="block">SAC</span><span class="block text-[11px] font-normal opacity-80">Parcelas decrescentes</span></button>
        <button type="button" data-sis="price" aria-pressed="false" class="sis-btn px-4 py-3 rounded-lg font-label-md text-label-md font-semibold transition-all"><span class="block">Tabela Price</span><span class="block text-[11px] font-normal opacity-80">Parcelas fixas</span></button>
      </div></div>
  </form>

  <!-- Resultado -->
  <aside class="lg:col-span-5 lg:sticky lg:top-32 flex flex-col gap-4" aria-live="polite">
    <div class="rounded-2xl p-6 sm:p-8 text-white shadow-lg" style="background:linear-gradient(160deg,#1f1b16,#2c241a)">
      <span class="font-label-sm text-label-sm uppercase tracking-widest" style="color:#edbf7b" id="r-label">Primeira parcela estimada</span>
      <div class="flex items-baseline gap-2 mt-2"><span class="font-display text-[44px] sm:text-[52px] leading-none font-semibold" style="color:#ffddaf" id="r-parcela">R$ 0</span><span class="text-white/70">/mês</span></div>
      <p class="font-label-md text-label-md text-white/70 mt-2" id="r-sub"></p>

      <div class="mt-6 h-3 rounded-full overflow-hidden bg-white/10 flex" role="img" aria-label="Proporção entre valor financiado e juros"><div id="b-princ" class="h-full" style="background:#c49a5a;width:60%"></div><div id="b-juros" class="h-full" style="background:#7a581f;width:40%"></div></div>
      <div class="flex justify-between font-label-sm text-label-sm mt-2 text-white/80"><span class="flex items-center gap-1.5"><i class="w-2.5 h-2.5 rounded-full inline-block" style="background:#c49a5a"></i>Valor financiado</span><span class="flex items-center gap-1.5"><i class="w-2.5 h-2.5 rounded-full inline-block" style="background:#7a581f"></i>Juros</span></div>

      <dl class="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 font-body-md text-body-md">
        <div><dt class="text-white/60 font-label-sm text-label-sm">Valor financiado</dt><dd class="font-semibold" id="r-fin">—</dd></div>
        <div><dt class="text-white/60 font-label-sm text-label-sm" id="r-t2">Última parcela</dt><dd class="font-semibold" id="r-ult">—</dd></div>
        <div><dt class="text-white/60 font-label-sm text-label-sm">Total de juros</dt><dd class="font-semibold" id="r-juros">—</dd></div>
        <div><dt class="text-white/60 font-label-sm text-label-sm">Total a pagar</dt><dd class="font-semibold" id="r-total">—</dd></div>
        <div class="col-span-2 border-t border-white/10 pt-4"><dt class="text-white/60 font-label-sm text-label-sm">Renda mensal recomendada (parcela até 30%)</dt><dd class="font-semibold text-[20px]" id="r-renda">—</dd></div>
      </dl>
      <div id="r-status" class="hidden mt-4 rounded-lg px-4 py-3 font-label-md text-label-md"></div>
    </div>

    <a id="r-wa" class="inline-flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-label-md text-label-md font-semibold shadow-md transition-all" href="https://wa.me/${WA}" target="_blank" rel="noopener noreferrer">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zM20.52 3.45A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.4z"/></svg>
      <span>Quero uma análise de crédito com a Rafaela</span></a>
    <p class="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">Simulação meramente informativa. Não inclui seguros, tarifas e correção pela TR, e não representa aprovação de crédito nem proposta de nenhuma instituição financeira.</p>
  </aside>
</section>

<section class="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin mt-20">
  <div class="text-center mb-10"><span class="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">Como funciona</span><h2 class="font-headline-lg text-headline-lg text-on-surface mt-2">Do sonho à chave, passo a passo</h2></div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
    ${[['calculate', '1. Simule', 'Descubra uma estimativa da parcela e da renda necessária para o imóvel que você quer.'], ['fact_check', '2. Organize a documentação', 'A Rafaela confere a documentação do imóvel e do vendedor e te orienta sobre os documentos do comprador.'], ['key', '3. Aprove e assine', 'Com o crédito aprovado, você segue para a escritura, o registro e a entrega das chaves com assessoria.']].map(([ic, t, d]) => `<div class="bg-surface-container-low rounded-2xl p-6"><span class="material-symbols-outlined text-primary text-[30px]">${ic}</span><h3 class="font-headline-sm text-headline-sm text-on-surface mt-3">${t}</h3><p class="font-body-md text-body-md text-on-surface-variant mt-2">${d}</p></div>`).join('')}
  </div>
</section>

<section class="max-w-3xl mx-auto px-margin-mobile lg:px-margin mt-20">
  <div class="text-center mb-8"><span class="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">Dúvidas frequentes</span><h2 class="font-headline-lg text-headline-lg text-on-surface mt-2">Perguntas sobre financiamento</h2></div>
  <div class="flex flex-col gap-3">${faqHtml}</div>
</section>

<style>
  .sis-btn{background:transparent;color:rgb(var(--c-on-surface-variant))}
  .sis-btn[aria-pressed=true]{background:rgb(var(--c-primary-container));color:rgb(var(--c-on-primary-container));box-shadow:0 1px 3px rgba(0,0,0,.15)}
  #sim-form input[type=range]{height:6px}
</style>
<script>
(function(){
  var $=function(i){return document.getElementById(i)};
  var sis='sac';
  var brl=function(n){return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0})};
  var num=function(s){return Number(String(s).replace(/\\D/g,''))||0};
  var mask=function(el){var v=num(el.value);el.value=v?v.toLocaleString('pt-BR'):''};
  var taxa=function(){return (parseFloat(String($('f-taxa').value).replace(',','.'))||0)};
  var syncing=false;

  function calc(){
    var V=num($('f-valor').value), E=num($('f-entrada').value);
    if(E>V){E=V}
    var F=Math.max(V-E,0), anos=+$('f-prazo').value, n=anos*12, im=taxa()/100/12, renda=num($('f-renda').value);
    $('o-prazo').textContent=anos+' anos ('+n+' meses)';
    var pct=V?Math.round(E/V*100):0; $('o-pct').textContent=pct+'%';
    var w=$('w-entrada');
    if(V&&pct<20){w.textContent='Atenção: com entrada abaixo de 20%, muitos bancos podem não aprovar o financiamento.';w.classList.remove('hidden')}else{w.classList.add('hidden')}
    var first,last,total;
    if(sis==='sac'){var am=F/n; first=am+F*im; last=am*(1+im); total=F+im*F*(n+1)/2}
    else{ if(im>0){first=F*im/(1-Math.pow(1+im,-n))}else{first=F/n} last=first; total=first*n }
    var juros=Math.max(total-F,0);
    $('r-label').textContent=sis==='sac'?'Primeira parcela estimada':'Parcela fixa estimada';
    $('r-parcela').textContent=brl(first);
    $('r-sub').textContent=sis==='sac'?'As parcelas diminuem mês a mês (SAC).':'Todas as parcelas têm o mesmo valor (Price).';
    $('r-fin').textContent=brl(F);
    $('r-t2').textContent=sis==='sac'?'Última parcela':'Prazo total';
    $('r-ult').textContent=sis==='sac'?brl(last):n+' meses';
    $('r-juros').textContent=brl(juros); $('r-total').textContent=brl(total);
    var pr=total?F/total*100:100; $('b-princ').style.width=pr+'%'; $('b-juros').style.width=(100-pr)+'%';
    $('r-renda').textContent=brl(first/0.3);
    var st=$('r-status');
    if(renda&&first){var cp=first/renda*100; st.classList.remove('hidden');
      if(cp<=30){st.style.background='rgba(61,226,115,.16)';st.style.color='#8df0ae';st.textContent='✓ A parcela compromete '+cp.toFixed(0)+'% da sua renda — dentro do limite de 30% que costuma ser usado.'}
      else if(cp<=35){st.style.background='rgba(251,188,4,.16)';st.style.color='#fbd35a';st.textContent='Atenção: a parcela compromete '+cp.toFixed(0)+'% da renda. Um prazo maior ou uma entrada maior pode ajudar.'}
      else{st.style.background='rgba(255,180,171,.16)';st.style.color='#ffb4ab';st.textContent='A parcela compromete '+cp.toFixed(0)+'% da renda, acima do que os bancos costumam aceitar. Aumente a entrada ou o prazo.'}}
    else st.classList.add('hidden');
    var msg='Olá, Rafaela! Fiz uma simulação de financiamento no site: imóvel de '+brl(V)+', entrada de '+brl(E)+' ('+pct+'%), prazo de '+anos+' anos, '+(sis==='sac'?'SAC':'Tabela Price')+', taxa de '+taxa().toString().replace('.',',')+'% a.a. '+(sis==='sac'?'Primeira parcela estimada: ':'Parcela estimada: ')+brl(first)+'. Gostaria de uma análise de crédito.';
    $('r-wa').href='https://wa.me/${WA}?text='+encodeURIComponent(msg);
  }
  $('f-valor').addEventListener('input',function(){mask(this);var V=num(this.value);$('f-entrada').value=Math.round(V*(+$('f-pct').value)/100).toLocaleString('pt-BR');calc()});
  $('f-entrada').addEventListener('input',function(){mask(this);var V=num($('f-valor').value),E=num(this.value);if(V)$('f-pct').value=Math.min(90,Math.round(E/V*100));calc()});
  $('f-pct').addEventListener('input',function(){var V=num($('f-valor').value);$('f-entrada').value=Math.round(V*(+this.value)/100).toLocaleString('pt-BR');calc()});
  $('f-prazo').addEventListener('input',calc);
  $('f-taxa').addEventListener('input',calc);
  $('f-renda').addEventListener('input',function(){mask(this);calc()});
  Array.prototype.forEach.call(document.querySelectorAll('.sis-btn'),function(b){b.addEventListener('click',function(){sis=b.dataset.sis;Array.prototype.forEach.call(document.querySelectorAll('.sis-btn'),function(x){x.setAttribute('aria-pressed',String(x===b))});calc()})});
  calc();
})();
</script>`;
};
