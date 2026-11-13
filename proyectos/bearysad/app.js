// Lógica compartida: catálogo, modal de producto, carrito, checkout simulado, reproductor y galería.
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clp = n => '$' + Math.round(n).toLocaleString('es-CL');
const byId = id => PRODUCTS.find(p => p.id === id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* ================= Carrito ================= */
let cart = store.get('bearysad-cart', []).filter(l => byId(l.id));
let promo = store.get('bearysad-promo', null);
if (promo && !PROMOS[promo]) promo = null;
const saveCart = () => { store.set('bearysad-cart', cart); store.set('bearysad-promo', promo); renderCart(); };

function addToCart(id, size, color, qty = 1, silent = false) {
  const key = [id, size, color || ''].join('|');
  const found = cart.find(l => l.key === key);
  if (found) found.qty += qty; else cart.push({ key, id, size, color, qty });
  saveCart();
  bumpCart();
  if (!silent) toast(`${byId(id).name} (${size}) agregado ✓`);
}
function bumpCart() { $$('.cart-btn').forEach(b => { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }); }

function totals(shipKey) {
  const count = cart.reduce((a, l) => a + l.qty, 0);
  const subtotal = cart.reduce((a, l) => a + byId(l.id).price * l.qty, 0);
  const discount = promo ? Math.round(subtotal * PROMOS[promo].pct / 100) : 0;
  const net = subtotal - discount;
  const freeShip = net >= FREE_SHIPPING;
  let shipping = null;
  if (shipKey) shipping = shipKey === 'retiro' ? 0 : shipKey === 'express' ? SHIPPING.express.price : freeShip ? 0 : SHIPPING[shipKey].price;
  return { count, subtotal, discount, net, freeShip, shipping, total: net + (shipping || 0) };
}

function renderCart() {
  const t = totals();
  $$('.cart-count').forEach(el => el.textContent = t.count);
  const items = $('#cart-items'); if (!items) return;
  $('#cart-title-count').textContent = t.count ? `(${t.count})` : '';
  if (!cart.length) {
    items.innerHTML = `<div class="empty"><img src="${BEAR_GIF}" alt="" width="90"><p>Tu carrito está vacío.</p>
      <button class="btn ghost" data-close data-goto="#tienda">Ir a la tienda</button></div>`;
  } else {
    items.innerHTML = cart.map(l => {
      const p = byId(l.id);
      return `<div class="line">
        <img src="${img(p.images[0], 200)}" alt="${p.name}">
        <div><div class="n">${p.name}</div>
          <div class="v">Talla ${l.size}${l.color ? ' · ' + l.color : ''} · ${clp(p.price)}</div>
          <div class="qty"><button data-q="-1" data-k="${l.key}" aria-label="Quitar uno">−</button><span>${l.qty}</span><button data-q="1" data-k="${l.key}" aria-label="Agregar uno">+</button></div>
          <button class="rm" data-rm="${l.key}">Eliminar</button></div>
        <div class="price">${clp(p.price * l.qty)}</div></div>`;
    }).join('');
  }
  const missing = Math.max(0, FREE_SHIPPING - t.net);
  $('#cart-foot').innerHTML = !cart.length ? '' : `
    <div class="ship-meter">
      <p>${missing ? `Te faltan <b>${clp(missing)}</b> para envío gratis` : '¡Tienes <b>envío gratis</b>! 🐻'}</p>
      <div class="bar"><i style="width:${Math.min(100, t.net / FREE_SHIPPING * 100)}%"></i></div>
    </div>
    ${promo
      ? `<div class="promo-on"><span>Código <b>${promo}</b> · ${PROMOS[promo].label}</span><button data-unpromo>Quitar</button></div>`
      : `<form class="promo" id="promo-form"><input name="code" placeholder="Código de descuento" autocomplete="off" aria-label="Código de descuento"><button class="chip">Aplicar</button></form>`}
    <div class="rows">
      <div><span>Subtotal</span><span>${clp(t.subtotal)}</span></div>
      ${t.discount ? `<div class="disc"><span>Descuento</span><span>−${clp(t.discount)}</span></div>` : ''}
      <div><span>Envío</span><span>${t.freeShip ? 'Gratis' : 'Se calcula al pagar'}</span></div>
    </div>
    <div class="total"><span>Total</span><span>${clp(t.net)}</span></div>
    <button class="btn add" id="checkout">Finalizar compra →</button>
    <p class="small">Prueba los códigos <b>BEARY10</b> o <b>ICONS15</b>. Compra simulada: no se realiza ningún cobro.</p>`;
}

/* ================= UI global ================= */
function toast(msg) {
  const t = $('#toast'); t.innerHTML = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200);
}
const lock = on => { document.body.style.overflow = on ? 'hidden' : ''; };
function openPanel(sel) { $(sel).classList.add('open'); $('#overlay').classList.add('open'); lock(true); }
function openCart() { closeAll(); openPanel('#drawer'); }
function closeAll() {
  ['#drawer', '#modal', '#overlay', '#co', '#lb'].forEach(s => $(s)?.classList.remove('open'));
  lock(false);
}

/* ================= Tarjeta de producto ================= */
function productCard(p) {
  const badge = p.oldPrice ? '<span class="badge sale">Oferta</span>' : p.tag ? `<span class="badge">${p.tag}</span>` : '';
  return `<article class="product reveal" data-id="${p.id}" tabindex="0" role="button" aria-label="Ver ${p.name}">
    <div class="ph">${badge}
      <img src="${img(p.images[0], 700)}" alt="${p.name}" loading="lazy">
      ${p.images[1] ? `<img class="alt" src="${img(p.images[1], 700)}" alt="" loading="lazy">` : ''}
      <span class="quick">${p.sizes.length === 1 ? 'Ver producto' : 'Elegir talla'}</span></div>
    <div class="meta"><span class="name">${p.name}</span><span class="price">${p.oldPrice ? `<s>${clp(p.oldPrice)}</s>` : ''}${clp(p.price)}</span></div>
    <div class="sizes-hint">${p.sizes.join(' · ')}</div>
  </article>`;
}

/* ================= Modal de producto ================= */
let state = {};
function openProduct(id) {
  const p = byId(id);
  state = { p, size: p.sizes.length === 1 ? p.sizes[0] : null, color: p.colors ? p.colors[0] : null, imgIdx: 0, qty: 1 };
  renderModal();
  closeAll(); openPanel('#modal');
}
const isSoldOut = (p, color, size) => !!(p.soldOut && color && p.soldOut[color]?.includes(size));

function renderModal() {
  const { p, color, imgIdx, qty } = state;
  if (state.size && isSoldOut(p, color, state.size)) state.size = null;
  const ok = !!state.size;
  $('#modal').innerHTML = `
    <button class="close" data-close aria-label="Cerrar">✕</button>
    <div class="gallery">
      <div class="main"><img src="${img(p.images[imgIdx], 1200)}" alt="${p.name}"></div>
      <div class="thumbs">${p.images.map((f, i) => `<button data-img="${i}" class="${i === imgIdx ? 'active' : ''}" aria-label="Foto ${i + 1}"><img src="${img(f, 160)}" alt=""></button>`).join('')}</div>
    </div>
    <div class="detail">
      <div><p class="kicker">Bearysad · ${CATEGORIES.find(c => c.id === p.cat).label}</p>
        <h2 class="display">${p.name}</h2></div>
      <div class="price">${p.oldPrice ? `<s>${clp(p.oldPrice)}</s>` : ''}${clp(p.price)}</div>
      <p class="desc">${p.desc}</p>
      ${p.colors ? `<div><div class="opt-label"><span>Color</span><span>${color}</span></div>
        <div class="opts">${p.colors.map(c => `<button class="opt ${c === color ? 'active' : ''}" data-color="${c}">${c}</button>`).join('')}</div></div>` : ''}
      <div><div class="opt-label"><span>Talla</span><span>${state.size || 'Selecciona una'}</span></div>
        <div class="opts">${p.sizes.map(s => `<button class="opt ${s === state.size ? 'active' : ''}" data-size="${s}" ${isSoldOut(p, color, s) ? 'disabled title="Agotado"' : ''}>${s}</button>`).join('')}</div></div>
      <div class="buy-row">
        <div class="qty big"><button data-mq="-1" aria-label="Menos">−</button><span>${qty}</span><button data-mq="1" aria-label="Más">+</button></div>
        <button class="btn add" id="add" ${ok ? '' : 'disabled'}>${ok ? 'Agregar — ' + clp(p.price * qty) : 'Selecciona una talla'}</button>
      </div>
      <button class="btn ghost buy-now" id="buy-now" ${ok ? '' : 'disabled'}>Comprar ahora</button>
      <p class="small">Envío gratis sobre ${clp(FREE_SHIPPING)} · Cambios dentro de 10 días · Pago simulado</p>
    </div>`;
}

/* ================= Checkout simulado ================= */
let co = null;
const coDefaults = () => ({ step: 1, errors: {}, data: { nombre: '', email: '', tel: '', ship: 'domicilio', region: 'Metropolitana', comuna: '', direccion: '', pago: 'webpay' } });
function openCheckout() {
  if (!cart.length) return toast('Tu carrito está vacío');
  const prev = co?.data; co = coDefaults();
  if (prev) Object.assign(co.data, prev); // recuerda lo escrito si vuelves a abrir
  renderCheckout(); closeAll(); openPanel('#co');
}
function validate(step) {
  const d = co.data, e = {};
  if (step === 1) {
    if (d.nombre.trim().length < 2) e.nombre = 'Escribe tu nombre';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Correo no válido';
    if (!/^(\+?56)?\s?9?\s?\d{4}\s?\d{4}$/.test(d.tel.replace(/\s/g, ''))) e.tel = 'Ej: +56 9 1234 5678';
  }
  if (step === 2 && d.ship !== 'retiro') {
    if (d.comuna.trim().length < 2) e.comuna = 'Escribe tu comuna';
    if (d.direccion.trim().length < 5) e.direccion = 'Escribe calle y número';
  }
  co.errors = e; return !Object.keys(e).length;
}
const field = (name, label, attrs = '') => `<label class="field ${co.errors[name] ? 'err' : ''}"><span>${label}</span>
  <input name="${name}" value="${esc(co.data[name])}" ${attrs}>${co.errors[name] ? `<em>${co.errors[name]}</em>` : ''}</label>`;
const radio = (name, value, title, sub, right = '') => `<label class="radio ${co.data[name] === value ? 'on' : ''}">
  <input type="radio" name="${name}" value="${value}" ${co.data[name] === value ? 'checked' : ''}>
  <span><b>${title}</b><small>${sub}</small></span><span class="r">${right}</span></label>`;
const etaDate = days => { const d = new Date(); let n = 0; while (n < days) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) n++; } return d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }); };

function summaryHTML(t) {
  return `<aside class="co-sum">
    <h4>Tu pedido <span>${t.count} ${t.count === 1 ? 'prenda' : 'prendas'}</span></h4>
    <div class="co-lines">${cart.map(l => { const p = byId(l.id); return `<div class="co-line">
      <div class="th"><img src="${img(p.images[0], 160)}" alt=""><i>${l.qty}</i></div>
      <div><b>${p.name}</b><small>Talla ${l.size}${l.color ? ' · ' + l.color : ''}</small></div><span>${clp(p.price * l.qty)}</span></div>`; }).join('')}</div>
    <div class="rows">
      <div><span>Subtotal</span><span>${clp(t.subtotal)}</span></div>
      ${t.discount ? `<div class="disc"><span>Descuento ${promo}</span><span>−${clp(t.discount)}</span></div>` : ''}
      <div><span>Envío</span><span>${t.shipping ? clp(t.shipping) : 'Gratis'}</span></div>
    </div>
    <div class="total"><span>Total</span><span>${clp(t.total)}</span></div>
  </aside>`;
}

function renderCheckout() {
  const d = co.data, t = totals(d.ship), el = $('#co');
  if (co.step === 'processing') {
    el.innerHTML = `<div class="co-center"><img src="${BEAR_GIF}" alt="" class="spin-bear"><h3 class="display">Procesando pago…</h3>
      <p class="small">Conectando con ${d.pago === 'webpay' ? 'Webpay' : d.pago === 'mp' ? 'Mercado Pago' : 'el banco'} (simulado)</p><div class="loader"><i></i></div></div>`;
    return;
  }
  if (co.step === 'done') {
    const o = co.order;
    el.innerHTML = `<button class="close" data-close aria-label="Cerrar">✕</button>
      <div class="co-center done">
        <div class="confetti">${Array.from({ length: 40 }, (_, i) => `<i style="--i:${i};left:${Math.random() * 100}%;animation-delay:${(Math.random() * .6).toFixed(2)}s;animation-duration:${(1.8 + Math.random() * 1.6).toFixed(2)}s"></i>`).join('')}</div>
        <img src="${BEAR_GIF}" alt="" width="120">
        <p class="kicker">Pedido ${o.id}</p>
        <h3 class="display">¡Gracias, ${esc(o.nombre.split(' ')[0])}!</h3>
        <p>Tu compra simulada fue confirmada. Enviamos el comprobante a <b>${esc(o.email)}</b>.</p>
        <div class="receipt">
          ${o.lines.map(l => `<div><span>${l.qty}× ${l.name} <small>${l.size}</small></span><span>${clp(l.price * l.qty)}</span></div>`).join('')}
          ${o.discount ? `<div class="disc"><span>Descuento</span><span>−${clp(o.discount)}</span></div>` : ''}
          <div><span>${o.shipLabel}</span><span>${o.shipping ? clp(o.shipping) : 'Gratis'}</span></div>
          <div class="tot"><span>Total pagado</span><span>${clp(o.total)}</span></div>
        </div>
        <p class="small">${o.ship === 'retiro' ? 'Disponible para retiro el' : 'Llega aprox. el'} <b>${o.eta}</b>${o.ship === 'retiro' ? '' : ` en ${esc(o.comuna)}, ${esc(o.region)}`}.</p>
        <div class="ctas"><button class="btn" data-close data-goto="#tienda">Seguir comprando</button><button class="btn ghost" data-close data-goto="#icons">Beary Icons</button></div>
        <p class="small">Proyecto de portafolio: no se realizó ningún cobro real.</p>
      </div>`;
    return;
  }
  const steps = ['Datos', 'Envío', 'Pago'];
  let body = '';
  if (co.step === 1) body = `<h3 class="display">¿Quién compra?</h3>
    ${field('nombre', 'Nombre y apellido', 'autocomplete="name"')}
    ${field('email', 'Correo', 'type="email" autocomplete="email"')}
    ${field('tel', 'Teléfono', 'type="tel" autocomplete="tel" placeholder="+56 9 1234 5678"')}`;
  if (co.step === 2) body = `<h3 class="display">¿Cómo te llega?</h3>
    <div class="radios">${Object.entries(SHIPPING).map(([k, s]) => radio('ship', k, s.label,
      k === 'retiro' ? 'Showroom Bearysad, Santiago' : `Llega aprox. el ${etaDate(s.eta)}`,
      k === 'retiro' ? 'Gratis' : (k === 'domicilio' && t.freeShip) ? 'Gratis' : clp(s.price))).join('')}</div>
    ${d.ship === 'retiro' ? '' : `<div class="grid2">
      <label class="field"><span>Región</span><select name="region">${REGIONES.map(r => `<option ${r === d.region ? 'selected' : ''}>${r}</option>`).join('')}</select></label>
      ${field('comuna', 'Comuna', 'autocomplete="address-level2"')}</div>
      ${field('direccion', 'Dirección', 'autocomplete="street-address" placeholder="Calle, número, depto"')}`}`;
  if (co.step === 3) body = `<h3 class="display">Pago</h3>
    <div class="radios">
      ${radio('pago', 'webpay', 'Webpay', 'Débito, crédito o prepago')}
      ${radio('pago', 'mp', 'Mercado Pago', 'Saldo o tarjetas guardadas')}
      ${radio('pago', 'transfer', 'Transferencia', 'Datos al confirmar el pedido')}
    </div>
    <p class="notice">🐻 Es una <b>compra simulada</b>: no se piden datos de tarjeta y no se cobra nada.</p>`;
  el.innerHTML = `<button class="close" data-close aria-label="Cerrar">✕</button>
    <div class="co-main">
      <ol class="steps">${steps.map((s, i) => `<li class="${i + 1 === co.step ? 'on' : i + 1 < co.step ? 'ok' : ''}"><i>${i + 1 < co.step ? '✓' : i + 1}</i>${s}</li>`).join('')}</ol>
      <form id="co-form" novalidate>${body}
        <div class="co-actions">
          ${co.step > 1 ? '<button type="button" class="btn ghost" data-co-back>← Atrás</button>' : '<span></span>'}
          <button class="btn" type="submit">${co.step === 3 ? `Pagar ${clp(t.total)}` : 'Continuar →'}</button>
        </div>
      </form>
    </div>
    ${summaryHTML(t)}`;
  const first = $('.field.err input', el); if (first) first.focus();
}

function placeOrder() {
  const d = co.data, t = totals(d.ship);
  co.order = {
    id: 'BS-' + Date.now().toString(36).toUpperCase().slice(-6), date: new Date().toISOString(),
    ...d, lines: cart.map(l => ({ ...l, name: byId(l.id).name, price: byId(l.id).price })),
    discount: t.discount, shipping: t.shipping, total: t.total, shipLabel: SHIPPING[d.ship].label, eta: etaDate(SHIPPING[d.ship].eta),
  };
  store.set('bearysad-orders', [...store.get('bearysad-orders', []), co.order]);
  co.step = 'processing'; renderCheckout();
  setTimeout(() => { cart = []; promo = null; saveCart(); co.step = 'done'; renderCheckout(); }, 2200);
}

document.addEventListener('submit', e => {
  if (e.target.id === 'promo-form') {
    e.preventDefault();
    const code = e.target.code.value.trim().toUpperCase();
    if (PROMOS[code]) { promo = code; saveCart(); toast(`Código ${code} aplicado: ${PROMOS[code].label}`); }
    else { e.target.classList.remove('shake'); void e.target.offsetWidth; e.target.classList.add('shake'); toast('Código no válido'); }
  }
  if (e.target.id === 'co-form') {
    e.preventDefault();
    if (!validate(co.step)) return renderCheckout();
    if (co.step < 3) { co.step++; renderCheckout(); $('#co').scrollTop = 0; } else placeOrder();
  }
});
document.addEventListener('input', e => {
  if (!co || !e.target.closest('#co-form')) return;
  const { name, value, type } = e.target;
  co.data[name] = value;
  if (type === 'radio' || e.target.tagName === 'SELECT') renderCheckout();
  else if (co.errors[name]) { delete co.errors[name]; e.target.closest('.field').classList.remove('err'); e.target.nextElementSibling?.remove(); }
});

/* ================= Reproductor (preview 30 s + visualizador) ================= */
const Player = {
  audio: Object.assign(new Audio(), { crossOrigin: 'anonymous', preload: 'none' }),
  icon: null, ctx: null, an: null, buf: null, raf: 0,
  html(icon) {
    const s = icon.song;
    return `<div class="player" data-player style="--c:${icon.theme.accent}">
      <button class="vinyl" data-play aria-label="Reproducir ${esc(s.title)}"><img src="${s.cover}" alt="Portada ${esc(s.title)}"><span class="hole"></span></button>
      <div class="p-body">
        <span class="p-label">${s.radio ? 'Bearysad Radio · suena en la tienda' : `Suena ${icon.name}`}</span>
        <strong class="p-title">${esc(s.title)}</strong>
        <span class="p-artist">${esc(s.artist)} · ${s.year}</span>
        <canvas class="viz" width="360" height="56" aria-hidden="true"></canvas>
        <div class="p-ctrl"><button class="p-play" data-play aria-label="Reproducir"><span class="i-play">▶</span><span class="i-pause">❚❚</span></button>
          <div class="p-bar" data-seek><i></i></div><span class="p-time">0:00 / 0:30</span></div>
      </div></div>`;
  },
  mount(root, icon, autoplay) {
    const was = !this.audio.paused;
    root.innerHTML = this.html(icon);
    if (this.icon !== icon) { this.audio.pause(); this.audio.src = icon.song.preview; this.icon = icon; }
    this.sync();
    if (autoplay && was) this.play();
  },
  setup() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      const src = this.ctx.createMediaElementSource(this.audio);
      this.an = this.ctx.createAnalyser(); this.an.fftSize = 64; this.an.smoothingTimeConstant = .8;
      src.connect(this.an); this.an.connect(this.ctx.destination);
      this.buf = new Uint8Array(this.an.frequencyBinCount);
    } catch { this.ctx = null; }
  },
  play() { this.setup(); this.ctx?.resume(); this.audio.play().catch(() => toast('No se pudo reproducir el preview')); },
  toggle() { this.audio.paused ? this.play() : this.audio.pause(); },
  sync() {
    const on = !this.audio.paused;
    document.body.classList.toggle('is-playing', on);
    $$('[data-player]').forEach(p => p.classList.toggle('playing', on));
    cancelAnimationFrame(this.raf);
    if (on) this.loop(); else document.documentElement.style.setProperty('--beat', 0);
  },
  loop() {
    const a = this.audio, dur = a.duration || 30;
    $$('[data-player]').forEach(p => {
      $('.p-bar i', p).style.width = (a.currentTime / dur * 100) + '%';
      $('.p-time', p).textContent = `${fmt(a.currentTime)} / ${fmt(dur)}`;
      const cv = $('.viz', p), g = cv.getContext('2d'), c = getComputedStyle(p).getPropertyValue('--c').trim() || '#f5c518';
      g.clearRect(0, 0, cv.width, cv.height);
      const n = 28, w = cv.width / n;
      for (let i = 0; i < n; i++) {
        const v = this.an ? this.buf[Math.min(this.buf.length - 1, Math.floor(i * this.buf.length / n * .8))] / 255 : (Math.sin(Date.now() / 180 + i) + 1) / 3;
        const h = Math.max(3, v * cv.height);
        g.fillStyle = c; g.globalAlpha = .35 + v * .65;
        g.fillRect(i * w + 1, cv.height - h, w - 3, h);
      }
    });
    if (this.an) {
      this.an.getByteFrequencyData(this.buf);
      const bass = (this.buf[1] + this.buf[2] + this.buf[3]) / 765;
      document.documentElement.style.setProperty('--beat', bass.toFixed(3));
    }
    this.raf = requestAnimationFrame(() => this.loop());
  },
};
const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
['play', 'pause', 'ended'].forEach(ev => Player.audio.addEventListener(ev, () => Player.sync()));

/* ================= Lightbox ================= */
let lb = { list: [], i: 0 };
function openLightbox(list, i) { lb = { list, i }; renderLb(); closeAll(); openPanel('#lb'); }
function renderLb() {
  const it = lb.list[lb.i];
  $('#lb').innerHTML = `<button class="close" data-close aria-label="Cerrar">✕</button>
    <button class="lb-nav prev" data-lb-step="-1" aria-label="Anterior">←</button>
    <figure><img src="${it.src}" alt="${esc(it.cap || 'Bearysad')}"><figcaption><span>${esc(it.cap || '')}</span><span>${lb.i + 1} / ${lb.list.length}</span></figcaption></figure>
    <button class="lb-nav next" data-lb-step="1" aria-label="Siguiente">→</button>`;
}

/* ================= Eventos ================= */
document.addEventListener('click', e => {
  const t = e.target;
  const on = s => t.closest(s);
  let el;
  if ((el = on('[data-play]'))) return Player.toggle();
  if ((el = on('[data-seek]'))) { const r = el.getBoundingClientRect(); const a = Player.audio; if (a.duration) a.currentTime = (e.clientX - r.left) / r.width * a.duration; return; }
  if ((el = on('.product[data-id]'))) return openProduct(el.dataset.id);
  if ((el = on('[data-img]'))) { state.imgIdx = +el.dataset.img; return renderModal(); }
  if ((el = on('[data-size]'))) { state.size = el.dataset.size; return renderModal(); }
  if ((el = on('[data-color]'))) { state.color = el.dataset.color; return renderModal(); }
  if ((el = on('[data-mq]'))) { state.qty = Math.max(1, Math.min(9, state.qty + +el.dataset.mq)); return renderModal(); }
  if (on('#add')) { addToCart(state.p.id, state.size, state.color, state.qty); return openCart(); }
  if (on('#buy-now')) { addToCart(state.p.id, state.size, state.color, state.qty, true); return openCheckout(); }
  if ((el = on('[data-close],#overlay'))) {
    closeAll();
    const go = el.dataset?.goto; if (go && $(go)) $(go).scrollIntoView({ behavior: 'smooth' });
    else if (go) location.href = 'index.html' + go;
    if (co?.step === 'done') co = null;
    return;
  }
  if (on('.cart-btn')) return openCart();
  if ((el = on('[data-q]'))) { const l = cart.find(x => x.key === el.dataset.k); l.qty += +el.dataset.q; if (l.qty < 1) cart = cart.filter(x => x !== l); return saveCart(); }
  if ((el = on('[data-rm]'))) { cart = cart.filter(x => x.key !== el.dataset.rm); return saveCart(); }
  if (on('[data-unpromo]')) { promo = null; return saveCart(); }
  if (on('#checkout')) return openCheckout();
  if (on('[data-co-back]')) { co.step--; co.errors = {}; return renderCheckout(); }
  if ((el = on('[data-lb-step]'))) { lb.i = (lb.i + +el.dataset.lbStep + lb.list.length) % lb.list.length; return renderLb(); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (co?.step !== 'processing') closeAll(); }
  if ($('#lb')?.classList.contains('open') && /Arrow(Left|Right)/.test(e.key)) { lb.i = (lb.i + (e.key === 'ArrowRight' ? 1 : -1) + lb.list.length) % lb.list.length; renderLb(); }
  if (e.key === 'Enter' && e.target.matches('.product[data-id]')) openProduct(e.target.dataset.id);
});

/* ================= Animaciones de entrada ================= */
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .08 });
const observeReveals = () => $$('.reveal:not(.in)').forEach(el => io.observe(el));

/* ================= Bloques comunes ================= */
document.body.insertAdjacentHTML('beforeend', `
  <div class="overlay" id="overlay"></div>
  <div class="modal" id="modal" role="dialog" aria-modal="true" aria-label="Producto"></div>
  <div class="co" id="co" role="dialog" aria-modal="true" aria-label="Checkout"></div>
  <div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Galería"></div>
  <aside class="drawer" id="drawer" aria-label="Carrito">
    <header><h3 class="display">Carrito <span id="cart-title-count"></span></h3><button class="close" style="position:static" data-close aria-label="Cerrar">✕</button></header>
    <div class="items" id="cart-items"></div>
    <footer id="cart-foot"></footer>
  </aside>
  <div class="toast" id="toast" role="status"></div>`);
renderCart();
