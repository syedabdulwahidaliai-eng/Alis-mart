// ===== Alis Mart — front-end interactivity =====

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Mobile menu toggle ---------- */
const menuToggle = document.getElementById('menuToggle');
const catNav = document.getElementById('catNav');
menuToggle.addEventListener('click', () => catNav.classList.toggle('open'));

/* ---------- Product data ---------- */
const PRODUCTS = [
  { id: 1, name: 'Tur Dal (1 kg)', cat: 'grocery', catLabel: 'Grocery', emoji: '🌾', price: 145, old: 165 },
  { id: 2, name: 'Sona Masoori Rice (5 kg)', cat: 'grocery', catLabel: 'Grocery', emoji: '🍚', price: 320, old: 350 },
  { id: 3, name: 'Groundnut Oil (1 L)', cat: 'grocery', catLabel: 'Grocery', emoji: '🛢️', price: 180, old: 200 },
  { id: 4, name: 'Wheat Atta (5 kg)', cat: 'grocery', catLabel: 'Grocery', emoji: '🌾', price: 210, old: 230 },
  { id: 5, name: 'Fresh Tomatoes (1 kg)', cat: 'fruits', catLabel: 'Vegetables', emoji: '🍅', price: 30, old: 40 },
  { id: 6, name: 'Fresh Onions (1 kg)', cat: 'fruits', catLabel: 'Vegetables', emoji: '🧅', price: 28, old: null },
  { id: 7, name: 'Banana (1 dozen)', cat: 'fruits', catLabel: 'Fruits', emoji: '🍌', price: 45, old: 55 },
  { id: 8, name: 'Fresh Apples (1 kg)', cat: 'fruits', catLabel: 'Fruits', emoji: '🍎', price: 160, old: 180 },
  { id: 9, name: 'Toned Milk (1 L)', cat: 'dairy', catLabel: 'Dairy', emoji: '🥛', price: 58, old: null },
  { id: 10, name: 'Paneer (200 g)', cat: 'dairy', catLabel: 'Dairy', emoji: '🧀', price: 90, old: 100 },
  { id: 11, name: 'Brown Bread', cat: 'dairy', catLabel: 'Bakery', emoji: '🍞', price: 45, old: 50 },
  { id: 12, name: 'Curd (500 g)', cat: 'dairy', catLabel: 'Dairy', emoji: '🥣', price: 35, old: null },
  { id: 13, name: 'Herbal Shampoo (200 ml)', cat: 'care', catLabel: 'Personal Care', emoji: '🧴', price: 150, old: 175 },
  { id: 14, name: 'Toothpaste (100 g)', cat: 'care', catLabel: 'Personal Care', emoji: '🪥', price: 55, old: 65 },
  { id: 15, name: 'Bathing Soap (Pack of 4)', cat: 'care', catLabel: 'Personal Care', emoji: '🧼', price: 120, old: 140 },
  { id: 16, name: 'Hand Sanitizer (100 ml)', cat: 'care', catLabel: 'Personal Care', emoji: '🧴', price: 60, old: 70 },
];

/* ---------- Render products ---------- */
const productGrid = document.getElementById('productGrid');

function renderProducts(filter = 'all') {
  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  productGrid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-thumb">
        ${p.old ? `<span class="product-badge">SAVE ₹${p.old - p.price}</span>` : ''}
        <span>${p.emoji}</span>
      </div>
      <div class="product-info">
        <span class="product-cat">${p.catLabel}</span>
        <span class="product-name">${p.name}</span>
        <div class="product-price-row">
          <span class="price-now">₹${p.price}</span>
          ${p.old ? `<span class="price-old">₹${p.old}</span>` : ''}
        </div>
        <button class="add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>
  `).join('');
}
renderProducts();

/* ---------- Tabs ---------- */
document.getElementById('tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(btn.dataset.tab);
});

/* ---------- Cart ---------- */
let cart = [];

const cartCountEl = document.getElementById('cartCount');
const cartBody = document.getElementById('cartBody');
const cartTotalEl = document.getElementById('cartTotal');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}
document.getElementById('cartBtn').addEventListener('click', (e) => { e.preventDefault(); openCart(); });
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function addToCart(id, btn) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  if (btn) {
    btn.textContent = 'Added ✓';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = 'Add to Cart'; btn.classList.remove('added'); }, 900);
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  renderCart();
}

function renderCart() {
  const totalQty = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.qty * c.price, 0);
  cartCountEl.textContent = totalQty;
  cartTotalEl.textContent = `₹${totalPrice}`;

  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="cart-empty">Your cart is empty. Start adding products!</p>';
    return;
  }

  cartBody.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-thumb">${c.emoji}</div>
      <div class="cart-item-info">
        <p>${c.name}</p>
        <span>Qty: ${c.qty} &times; ₹${c.price}</span>
      </div>
      <button class="cart-item-remove" data-remove="${c.id}">Remove</button>
    </div>
  `).join('');
}

productGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-btn');
  if (!btn) return;
  addToCart(Number(btn.dataset.id), btn);
});

cartBody.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  removeFromCart(Number(btn.dataset.remove));
});

/* ---------- Newsletter ---------- */
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.reset();
  alert('Thanks for subscribing to Alis Mart updates!');
});
