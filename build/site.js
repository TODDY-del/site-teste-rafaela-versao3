/* Rafaela Requi Imóveis – comportamento comum do site */
(function () {
  var WA = '5516994602780';
  var here = location.pathname.split('/').pop() || 'index.html';
  var q = new URLSearchParams(location.search);
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function brl(n) { return Number(n).toLocaleString('pt-BR'); }

  /* ---------- favoritos (localStorage) ---------- */
  var KEY = 'rr_favs';
  function favs() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function saveFavs(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function isFav(s) { return favs().indexOf(s) > -1; }
  function toggleFav(s) { var a = favs(), i = a.indexOf(s); if (i > -1) a.splice(i, 1); else a.push(s); saveFavs(a); return i === -1; }
  function paintFavs() {
    $$('.fav-toggle').forEach(function (b) {
      var on = isFav(b.dataset.slug), ic = $('.material-symbols-outlined', b);
      ic.style.fontVariationSettings = on ? "'FILL' 1" : "'FILL' 0";
      b.classList.toggle('text-error', on); b.classList.toggle('text-on-surface-variant', !on);
      b.setAttribute('aria-pressed', on);
    });
    var bd = $('#btn-fav');
    if (bd) {
      var on = isFav(bd.dataset.slug), ic = $('#fav-icon'), tx = $('#fav-text');
      ic.textContent = on ? 'favorite' : 'favorite_border'; ic.style.fontVariationSettings = on ? "'FILL' 1" : "'FILL' 0";
      ic.classList.toggle('text-error', on); tx.textContent = on ? 'Salvo' : 'Salvar';
    }
    var hl = $('a[data-path="favoritos"]');
    if (hl) { hl.href = 'imoveis.html?favoritos=1'; var bdg = $('span:last-child', hl); if (bdg) { bdg.textContent = favs().length; bdg.style.display = favs().length ? '' : 'none'; } }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.fav-toggle, #btn-fav');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    toggleFav(b.dataset.slug); paintFavs();
    if (here === 'imoveis.html' && q.get('favoritos')) applyFilters();
  }, true);

  /* ---------- âncoras (sobre / blog / contato) ---------- */
  function mark(re, id) {
    if (document.getElementById(id)) return;
    var hs = $$('h1,h2,h3');
    for (var i = 0; i < hs.length; i++) if (re.test(hs[i].textContent)) { (hs[i].closest('section') || hs[i]).id = id; return; }
  }

  /* ---------- menu mobile ---------- */
  function mobileMenu() {
    var btn = $('button[aria-label="Menu Principal"]'), nav = $('header nav');
    if (!btn || !nav) return;
    var p = document.createElement('div'); p.id = 'mobile-menu';
    p.className = 'xl:hidden hidden fixed inset-x-0 top-[116px] z-40 bg-surface shadow-xl border-t border-outline-variant/30 max-h-[calc(100vh-116px)] overflow-y-auto';
    p.innerHTML = '<div class="flex flex-col p-4 gap-1">' + $$('a', nav).map(function (a) {
      return '<a class="px-3 py-3 rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container" href="' + a.getAttribute('href') + '">' + a.textContent + '</a>';
    }).join('') + '<a class="mt-2 text-center bg-primary-container text-on-primary-container font-label-md text-label-md px-4 py-3 rounded-lg font-semibold" href="https://wa.me/' + WA + '" target="_blank" rel="noopener noreferrer">Fale no WhatsApp</a></div>';
    document.body.appendChild(p);
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () { var hd = $('header'); p.style.top = Math.round(hd.getBoundingClientRect().bottom) + 'px'; var h = p.classList.toggle('hidden'); btn.setAttribute('aria-expanded', String(!h)); $('span', btn).textContent = h ? 'menu' : 'close'; });
    p.addEventListener('click', function (e) { if (e.target.closest('a')) p.classList.add('hidden'); });
  }

  /* ---------- home: busca ---------- */
  function homeSearch() {
    var f = $('#home-search'); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = new URLSearchParams(), v = function (n) { return f.elements[n] ? f.elements[n].value : ''; };
      var alug = $('#tab-alugar') && $('#tab-alugar').classList.contains('bg-primary');
      p.set('finalidade', alug ? 'aluguel' : 'venda');
      if (v('tipo')) p.set('tipo', v('tipo'));
      var loc = v('local'), map = { 'ig-centro': ['igarapava', 'centro'], 'ig-planalto': ['igarapava', 'planalto'], 'ig-nova': ['igarapava', 'nova'] };
      if (loc) { var m = map[loc]; p.set('cidade', m ? m[0] : loc); if (m) p.set('bairro', m[1]); }
      if (v('preco')) p.set('preco', v('preco'));
      if (v('quartos')) p.set('quartos', v('quartos'));
      location.href = 'imoveis.html?' + p.toString();
    });
  }

  /* ---------- listagem: filtros reais ---------- */
  var MAXP = 3500000;
  var state = { fin: '', tipos: [], cidade: 'todas', bairro: 'todos', pmin: 0, pmax: MAXP, quartos: 0, feats: [], sort: 'recent', fav: false };
  var LBL = { casa: 'Casa Térrea', rancho: 'Rancho', terreno: 'Terreno', chacara: 'Chácara', apartamento: 'Apartamento', comercial: 'Ponto Comercial', igarapava: 'Igarapava', rifaina: 'Rifaina', pedregulho: 'Pedregulho', buritizal: 'Buritizal', aramina: 'Aramina', piscina: 'Piscina', gourmet: 'Área gourmet', financiamento: 'Aceita financiamento', permuta: 'Aceita permuta' };
  function txtNum(s) { return Number(String(s).replace(/\D/g, '')) || 0; }
  var citySel, bairroSel, slider, sortSel;

  function readForm() {
    var f = $('#catalog-filter-form'); if (!f) return;
    var tb = $$('input[type=checkbox][value]', f);
    if (tb.length) state.tipos = tb.filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
    if (citySel) state.cidade = citySel.value;
    if (bairroSel) state.bairro = bairroSel.value;
    if (slider) state.pmax = Number(slider.value);
    state.feats = $$('input[data-feat]', f).filter(function (i) { return i.checked; }).map(function (i) { return i.dataset.feat; });
    if (sortSel) state.sort = sortSel.value;
  }
  function chip(label, onx) {
    var s = document.createElement('span');
    s.className = 'inline-flex items-center gap-1 bg-surface-container-high text-on-surface font-label-sm text-label-sm px-2.5 py-1 rounded-full';
    s.innerHTML = label + ' <button type="button" aria-label="Remover filtro" class="material-symbols-outlined text-[14px] leading-none">close</button>';
    $('button', s).addEventListener('click', onx); return s;
  }
  function applyFilters() {
    readForm();
    var grid = $('#catalog-grid'); if (!grid) return;
    var cards = $$('article', grid), shown = 0, fv = favs();
    var order = cards.slice().sort(function (a, b) {
      var pa = +a.dataset.preco, pb = +b.dataset.preco;
      if (state.sort === 'price-asc') return pa - pb;
      if (state.sort === 'price-desc') return pb - pa;
      return +a.dataset.ord - +b.dataset.ord;
    });
    var empty = $('#empty-state');
    order.forEach(function (c) { grid.insertBefore(c, empty); });
    cards.forEach(function (c) {
      var d = c.dataset, ok = true;
      if (state.fin && d.fin !== state.fin) ok = false;
      if (state.tipos.length && state.tipos.indexOf(d.tipo) < 0) ok = false;
      if (state.cidade !== 'todas' && d.cidade !== state.cidade) ok = false;
      if (state.bairro !== 'todos' && d.bairro !== state.bairro) ok = false;
      if (d.fin === 'venda' && d.preco && (+d.preco > state.pmax || +d.preco < state.pmin)) ok = false;
      if (state.quartos && +d.quartos < state.quartos) ok = false;
      var ft = d.feats.split(' ');
      if (state.feats.some(function (x) { return ft.indexOf(x) < 0; })) ok = false;
      if (state.fav && fv.indexOf(d.slug) < 0) ok = false;
      c.classList.toggle('hidden', !ok); if (ok) shown++;
    });
    $('#properties-count-badge').textContent = 'Exibindo ' + shown + (shown === 1 ? ' imóvel' : ' imóveis');
    empty.classList.toggle('hidden', shown > 0);
    if (slider) {
      var ro = $('#price-readout'); if (ro) ro.textContent = 'Até R$ ' + brl(state.pmax);
      var inputs = $$('#catalog-filter-form input[type=text]');
      if (inputs[0] && document.activeElement !== inputs[0]) inputs[0].value = 'R$ ' + brl(state.pmin);
      if (inputs[1] && document.activeElement !== inputs[1]) inputs[1].value = 'R$ ' + brl(state.pmax);
    }
    $$('#catalog-filter-form button[data-value]').forEach(function (b) {
      var on = b.dataset.value === state.fin;
      ['bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-semibold'].forEach(function (c) { b.classList.toggle(c, on); });
      b.classList.toggle('text-on-surface-variant', !on); b.setAttribute('aria-pressed', on);
    });
    $$('#catalog-filter-form button').filter(function (b) { return /^(Todos|\d\+)$/.test(b.textContent.trim()); }).forEach(function (b) {
      var n = parseInt(b.textContent, 10) || 0, on = n === state.quartos;
      ['bg-primary-container', 'text-on-primary-container', 'font-semibold'].forEach(function (c) { b.classList.toggle(c, on); });
    });
    var box = $('#active-filters'); box.innerHTML = '';
    var any = false, add = function (l, fn) { if (!any) { var t = document.createElement('span'); t.className = 'font-label-sm text-label-sm text-on-surface-variant'; t.textContent = 'Filtros ativos:'; box.appendChild(t); any = true; } box.appendChild(chip(l, function () { fn(); applyFilters(); })); };
    if (state.fin && $('#catalog-filter-form button[data-value]')) add(state.fin === 'venda' ? 'Comprar' : 'Alugar', function () { state.fin = ''; });
    state.tipos.forEach(function (t) { add(LBL[t] || t, function () { var i = $('#catalog-filter-form input[value="' + t + '"]'); if (i) i.checked = false; state.tipos = state.tipos.filter(function (x) { return x !== t; }); }); });
    if (state.cidade !== 'todas') add(LBL[state.cidade] || state.cidade, function () { if (citySel) citySel.value = 'todas'; state.cidade = 'todas'; });
    if (state.bairro !== 'todos' && bairroSel) add(bairroSel.selectedOptions[0].text, function () { bairroSel.value = 'todos'; });
    if (state.quartos) add(state.quartos + '+ quartos', function () { state.quartos = 0; });
    if (slider && state.pmin) add('A partir de R$ ' + brl(state.pmin), function () { state.pmin = 0; });
    if (slider && state.pmax < MAXP) add('Até R$ ' + brl(state.pmax), function () { slider.value = MAXP; });
    state.feats.forEach(function (x) { add(LBL[x] || x, function () { var i = $('input[data-feat="' + x + '"]'); if (i) i.checked = false; }); });
    if (state.fav) add('Meus favoritos', function () { state.fav = false; q.delete('favoritos'); history.replaceState(null, '', location.pathname); });
    if (any) { var c = document.createElement('button'); c.type = 'button'; c.className = 'font-label-sm text-label-sm text-primary font-semibold underline'; c.textContent = 'Limpar todos'; c.onclick = resetFilters; box.appendChild(c); }
  }
  function resetFilters() {
    var f = $('#catalog-filter-form'); f.reset();
    $$('input[type=checkbox]', f).forEach(function (i) { i.checked = false; });
    if (citySel) citySel.value = 'todas'; if (bairroSel) bairroSel.value = 'todos'; if (slider) slider.value = MAXP;
    state.fin = ''; state.tipos = []; state.cidade = 'todas'; state.quartos = 0; state.pmin = 0; state.fav = false; history.replaceState(null, '', location.pathname);
    applyFilters();
  }
  function listing() {
    var f = $('#catalog-filter-form'); if (!f) return;
    citySel = $('#filter-city'); bairroSel = $('#filter-neighborhood'); slider = $('#price-slider'); sortSel = $('#sort-selector');
    if (q.get('finalidade')) state.fin = q.get('finalidade');
    if (q.get('tipo')) { var t = $('input[type=checkbox][value="' + q.get('tipo') + '"]', f); if (t) t.checked = true; else state.tipos = [q.get('tipo')]; }
    if (q.get('cidade')) { if (citySel) citySel.value = q.get('cidade'); else state.cidade = q.get('cidade'); }
    if (q.get('bairro') && bairroSel) bairroSel.value = q.get('bairro');
    if (q.get('quartos')) state.quartos = parseInt(q.get('quartos'), 10) || 0;
    var pr = q.get('preco');
    if (slider) { if (pr === '250') slider.value = 250000; else if (pr === '500') { state.pmin = 250000; slider.value = 500000; } else if (pr === '1000') { state.pmin = 500000; slider.value = 1000000; } else if (pr === 'acima') state.pmin = 1000000; }
    if (q.get('favoritos')) state.fav = true;
    f.addEventListener('submit', function (e) { e.preventDefault(); applyFilters(); $('#catalog-grid').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    f.addEventListener('change', applyFilters);
    if (slider) slider.addEventListener('input', applyFilters);
    var tin = $$('input[type=text]', f);
    if (slider && tin[0]) tin[0].addEventListener('change', function () { state.pmin = txtNum(tin[0].value); applyFilters(); });
    if (slider && tin[1]) tin[1].addEventListener('change', function () { var v = txtNum(tin[1].value) || MAXP; slider.value = Math.min(Math.max(v, 150000), MAXP); applyFilters(); });
    $$('button[data-value]', f).forEach(function (b) { b.addEventListener('click', function () { state.fin = state.fin === b.dataset.value ? '' : b.dataset.value; applyFilters(); }); });
    $$('button', f).filter(function (b) { return /^(Todos|\d\+)$/.test(b.textContent.trim()); }).forEach(function (b) { b.addEventListener('click', function () { state.quartos = parseInt(b.textContent, 10) || 0; applyFilters(); }); });
    $('#btn-reset-filters').addEventListener('click', resetFilters);
    var grid = $('#catalog-grid'), vb = $$('.view-btn');
    vb.forEach(function (b, i) {
      b.addEventListener('click', function () {
        if (i === 2) { window.open('https://www.google.com/maps/search/' + encodeURIComponent('imóveis Igarapava SP'), '_blank', 'noopener'); return; }
        vb.forEach(function (x) { x.classList.remove('active', 'bg-surface-container-lowest', 'text-primary', 'shadow-sm'); x.classList.add('text-on-surface-variant'); });
        b.classList.add('active', 'bg-surface-container-lowest', 'text-primary', 'shadow-sm'); b.classList.remove('text-on-surface-variant');
        grid.classList.toggle('md:grid-cols-2', i === 0);
      });
    });
    applyFilters();
    if (q.toString()) setTimeout(function () { $('#catalog-grid').scrollIntoView({ block: 'start' }); window.scrollBy(0, -140); }, 150);
  }

  /* ---------- imagens dos cards: ilustrativas x fotos reais ---------- */
  function paintPhotos() {
    var real = document.documentElement.getAttribute('data-photos') === 'real';
    $$('.photo-opt').forEach(function (b) { b.setAttribute('aria-pressed', String((b.dataset.photos === 'real') === real)); });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.photo-opt'); if (!b) return;
    var real = b.dataset.photos === 'real';
    if (real) document.documentElement.setAttribute('data-photos', 'real'); else document.documentElement.removeAttribute('data-photos');
    try { localStorage.setItem('rr_photos', real ? 'real' : 'stitch'); } catch (x) {}
    paintPhotos();
  });

  /* ---------- avaliação: formulário -> WhatsApp ---------- */
  window.submitEvaluation = function (e) {
    e.preventDefault();
    var f = document.getElementById('evaluationForm'), v = function (id) { return document.getElementById(id).value.trim(); };
    var tipo = ($('input[name=propertyType]:checked', f) || {}).value || '';
    var fin = document.getElementById('evalPurpose'), fin_t = fin.options[fin.selectedIndex].text;
    var msg = 'Olá, Rafaela! Gostaria de solicitar uma avaliação de imóvel.\n' +
      '• Tipo: ' + tipo + '\n• Finalidade: ' + fin_t + '\n• Local: ' + v('evalNeighborhood') + ', ' + v('evalCity') + '\n' +
      (v('evalDetails') ? '• Detalhes: ' + v('evalDetails') + '\n' : '') +
      '• Nome: ' + v('userName') + '\n• WhatsApp: ' + v('userPhone') + '\n• E-mail: ' + v('userEmail');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    document.getElementById('formSuccess').classList.remove('hidden'); f.classList.add('hidden');
  };

  /* ---------- tema claro / escuro ---------- */
  function currentTheme() { return document.documentElement.classList.contains('dark') ? 'dark' : 'light'; }
  function paintTheme() {
    var d = currentTheme() === 'dark', b = $('#theme-toggle');
    if (b) { b.setAttribute('aria-pressed', String(d)); b.setAttribute('aria-label', d ? 'Ativar tema claro' : 'Ativar tema escuro'); b.title = d ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'; }
    var mt = $('meta[name="theme-color"]'); if (mt) mt.setAttribute('content', d ? '#161513' : '#C49A5A');
  }
  function setTheme(t, animate) {
    var r = document.documentElement;
    if (animate) { r.classList.add('theme-anim'); setTimeout(function () { r.classList.remove('theme-anim'); }, 450); }
    r.classList.toggle('dark', t === 'dark'); r.style.colorScheme = t;
    try { localStorage.setItem('rr_theme', t); } catch (e) {}
    paintTheme(); paintPhotos();
  }
  document.addEventListener('click', function (e) { if (e.target.closest('#theme-toggle')) setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true); });
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) { var s = null; try { s = localStorage.getItem('rr_theme'); } catch (x) {} if (!s) { document.documentElement.classList.toggle('dark', e.matches); paintTheme(); } }); } catch (e) {}
  window.addEventListener('storage', function (e) { if (e.key === 'rr_theme' && e.newValue) { document.documentElement.classList.toggle('dark', e.newValue === 'dark'); paintTheme(); } });


  /* ---------- barra superior some ao rolar no mobile ---------- */
  function topBar() {
    var hd = $('header'); if (!hd || !hd.firstElementChild) return;
    var bar = hd.firstElementChild, mq = matchMedia('(max-width: 1023px)');
    function measure() { hd.style.setProperty('--bar-h', bar.offsetHeight + 'px'); }
    function update() {
      var hide = mq.matches && window.scrollY > 24;
      hd.classList.toggle('bar-hidden', hide);
      var mp = document.getElementById('mobile-menu'); if (mp && !mp.classList.contains('hidden')) mp.style.top = Math.max(0, Math.round(hd.getBoundingClientRect().bottom)) + 'px';
    }
    measure(); update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', function () { measure(); update(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    topBar();
    paintTheme();
    mark(/Olá, sou|Prazer em receber/i, 'sobre'); mark(/Bicas|Mercado Regional|Artigos/i, 'blog');
    var ft = $('footer'); if (ft && !ft.id) ft.id = 'contato';
    paintFavs(); mobileMenu(); homeSearch(); listing();
    if (location.hash && $(location.hash)) setTimeout(function () { $(location.hash).scrollIntoView(); window.scrollBy(0, -130); }, 120);
  });
})();
