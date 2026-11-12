// Lógica compartida: catálogo, modal de producto, carrito (guardado en localStorage).
const $ = (s, el = document) => el.querySelector(s);
const clp = n => '$' + n.toLocaleString('es-CL');
const byId = id => PRODUCTS.find(p => p.id === id);

/* ---------- Carrito ---------- */
const CART_KEY = 'bearysad-cart';
let cart = [];
try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { cart = []; }
const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {} renderCart(); };

function addToCart(id, size, color) {
  const key = [id, size, color || ''].join('|');
  const found = cart.find(l => l.key === key);
  if (found) found.qty++; else cart.push({ key, id, size, color, qty: 1 });
  saveCart();
  toast('Agregado al carrito ✓');
}

function renderCart() {
  const count = cart.reduce((a, l) => a + l.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  const items = $('#cart-items'); if (!items) return;
  if (!cart.length) {
    items.innerHTML = '<p class="empty">Tu carrito está vacío.<br>Elige una prenda y una talla.</p>';
  } else {
    items.innerHTML = cart.map(l => {
      const p = byId(l.id);
      return `<div class="line">
        <img src="${img(p.images[0], 200)}" alt="${p.name}">
        <div><div class="n">${p.name}</div>
          <div class="v">Talla ${l.size}${l.color ? ' · ' + l.color : ''}</div>
          <div class="qty"><button data-q="-1" data-k="${l.key}" aria-label="Quitar uno">−</button><span>${l.qty}</span><button data-q="1" data-k="${l.key}" aria-label="Agregar uno">+</button></div>
          <button class="rm" data-rm="${l.key}">Eliminar</button></div>
        <div class="price">${clp(p.price * l.qty)}</div></div>`;
    }).join('');
  }
  const total = cart.reduce((a, l) => a + byId(l.id).price * l.qty, 0);
  $('#cart-total').textContent = clp(total);
  $('#checkout').disabled = !cart.length;
}

/* ---------- UI global ---------- */
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2000);
}
const overlay = () => $('#overlay');
function openCart() { $('#drawer').classList.add('open'); overlay().classList.add('open'); }
function closeAll() {
  ['#drawer', '#modal', '#overlay'].forEach(s => $(s)?.classList.remove('open'));
  document.body.style.overflow = '';
}

/* ---------- Tarjeta de producto ---------- */
function productCard(p) {
  const badge = p.oldPrice ? '<span class="badge sale">Oferta</span>' : p.tag ? `<span class="badge">${p.tag}</span>` : '';
  return `<article class="product reveal" data-id="${p.id}">
    <div class="ph">${badge}
      <img src="${img(p.images[0], 700)}" alt="${p.name}" loading="lazy">
      ${p.images[1] ? `<img class="alt" src="${img(p.images[1], 700)}" alt="" loading="lazy">` : ''}
      <span class="quick">Elegir talla</span></div>
    <div class="meta"><span class="name">${p.name}</span><span class="price">${p.oldPrice ? `<s>${clp(p.oldPrice)}</s>` : ''}${clp(p.price)}</span></div>
    <div class="sizes-hint">${p.sizes.join(' · ')}</div>
  </article>`;
}

/* ---------- Modal de producto ---------- */
let state = {};
function openProduct(id) {
  const p = byId(id);
  state = { p, size: null, color: p.colors ? p.colors[0] : null, imgIdx: 0 };
  if (p.sizes.length === 1) state.size = p.sizes[0];
  renderModal();
  $('#modal').classList.add('open'); overlay().classList.add('open');
  document.body.style.overflow = 'hidden';
}
function isSoldOut(p, color, size) { return !!(p.soldOut && color && p.soldOut[color]?.includes(size)); }

function renderModal() {
  const { p, size, color, imgIdx } = state;
  if (size && isSoldOut(p, color, size)) state.size = null;
  $('#modal').innerHTML = `
    <button class="close" data-close aria-label="Cerrar">✕</button>
    <div class="gallery">
      <div class="main"><img src="${img(p.images[imgIdx], 1200)}" alt="${p.name}"></div>
      <div class="thumbs">${p.images.map((f, i) => `<button data-img="${i}" class="${i === imgIdx ? 'active' : ''}"><img src="${img(f, 160)}" alt=""></button>`).join('')}</div>
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
      <button class="btn add" id="add" ${state.size ? '' : 'disabled'}>${state.size ? 'Agregar al carrito — ' + clp(p.price) : 'Selecciona una talla'}</button>
      <p class="small">Envíos a todo Chile · Cambios dentro de 10 días · Pago seguro</p>
    </div>`;
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-id],[data-img],[data-size],[data-color],#add,[data-close],#overlay,.cart-btn,[data-q],[data-rm],#checkout');
  if (!t) return;
  if (t.matches('.product[data-id]')) return openProduct(t.dataset.id);
  if (t.dataset.img) { state.imgIdx = +t.dataset.img; return renderModal(); }
  if (t.dataset.size) { state.size = t.dataset.size; return renderModal(); }
  if (t.dataset.color) { state.color = t.dataset.color; return renderModal(); }
  if (t.id === 'add') { addToCart(state.p.id, state.size, state.color); closeAll(); return openCart(); }
  if (t.matches('[data-close],#overlay')) return closeAll();
  if (t.matches('.cart-btn')) return openCart();
  if (t.dataset.q) { const l = cart.find(x => x.key === t.dataset.k); l.qty += +t.dataset.q; if (l.qty < 1) cart = cart.filter(x => x !== l); return saveCart(); }
  if (t.dataset.rm) { cart = cart.filter(x => x.key !== t.dataset.rm); return saveCart(); }
  if (t.id === 'checkout') { toast('Demo de portafolio: compra en bearysad.com'); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

/* ---------- Animaciones de entrada ---------- */
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
const observeReveals = () => document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));

/* ---------- Bloques comunes (carrito, modal, toast) ---------- */
document.body.insertAdjacentHTML('beforeend', `
  <div class="overlay" id="overlay"></div>
  <div class="modal" id="modal" role="dialog" aria-modal="true"></div>
  <aside class="drawer" id="drawer" aria-label="Carrito">
    <header><h3 class="display">Carrito</h3><button class="close" style="position:static" data-close aria-label="Cerrar">✕</button></header>
    <div class="items" id="cart-items"></div>
    <footer><div class="total"><span>Total</span><span id="cart-total">$0</span></div>
      <button class="btn add" id="checkout">Finalizar compra</button>
      <p class="small">Proyecto de portafolio. Para comprar de verdad visita <a href="https://bearysad.com" target="_blank" rel="noopener" style="text-decoration:underline">bearysad.com</a>.</p></footer>
  </aside>
  <div class="toast" id="toast"></div>`);
renderCart();
