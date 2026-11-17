document.addEventListener('DOMContentLoaded',()=>{
  const here=location.pathname.split('/').pop();
  // cards de imóvel levam ao detalhe
  if(here!=='imovel.html'){
    document.querySelectorAll('article').forEach(a=>{
      if(!a.querySelector('img'))return;
      const t=a.querySelector('h2,h3,h4');
      if(t&&/Rafaela|Quanto|Artigo/i.test(t.textContent)&&!a.textContent.match(/R\$/))return;
      if(!a.textContent.includes('R$'))return;
      a.style.cursor='pointer';
      a.addEventListener('click',e=>{if(e.target.closest('a,button'))return;location.href='imovel.html';});
    });
  }
  // âncoras
  const mark=(re,id,up)=>{if(document.getElementById(id))return;
    for(const h of document.querySelectorAll('h1,h2,h3')){if(re.test(h.textContent)){(h.closest('section')||h).id=id;return;}}};
  mark(/Olá, sou|Prazer em receber/i,'sobre');
  mark(/Bicas/i,'blog');
  const f=document.querySelector('footer');if(f&&!f.id)f.id='contato';
  if(location.hash){const el=document.querySelector(location.hash);if(el)setTimeout(()=>el.scrollIntoView(),50);}
  // favoritos
  document.querySelectorAll('button[aria-label*="avorit"],button:has(.material-symbols-outlined)').forEach(b=>{
    if(!/^\s*favorite(_border)?\s*$/.test(b.textContent))return;
    b.addEventListener('click',e=>{e.stopPropagation();const i=b.querySelector('.material-symbols-outlined');
      const on=i.style.fontVariationSettings.includes("'FILL' 1");
      i.style.fontVariationSettings=on?"'FILL' 0":"'FILL' 1";});
  });
});
