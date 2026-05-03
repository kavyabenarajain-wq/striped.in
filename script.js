// ────────── reveal-on-scroll ──────────
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ────────── nav inverts on dark sections ──────────
const nav = document.querySelector(".nav");
const darkSections = []; // currently nav stays light; left as a hook for future dark sections
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) nav.classList.add("invert");
    else nav.classList.remove("invert");
  });
}, { rootMargin: "-50% 0px -50% 0px" });
darkSections.forEach((s) => navObserver.observe(s));

// ────────── cart (persisted) ──────────
const CART_KEY = "dc_cart";
let cart = [];
try {
  const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  if (Array.isArray(stored)) cart = stored;
} catch (_) {}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_) {}
}
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartPanel  = document.getElementById("cart");
const cartScrim  = document.getElementById("cart-scrim");
const cartLink   = document.querySelector(".cart-link");
const cartClose  = document.getElementById("cart-close");

function renderCart() {
  cartCountEl.textContent = `(${cart.length})`;
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<li class="cart-empty">empty.</li>`;
  } else {
    cartItemsEl.innerHTML = cart.map((it, i) => `
      <li>
        <div>
          <div class="item-name">${it.name}</div>
          <div class="item-meta">₹${it.price}</div>
        </div>
        <button class="item-remove" data-idx="${i}">remove</button>
      </li>
    `).join("");
    cartItemsEl.querySelectorAll(".item-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        cart.splice(parseInt(btn.dataset.idx, 10), 1);
        renderCart();
      });
    });
  }
  cartTotalEl.textContent = `₹${cart.reduce((s, it) => s + it.price, 0)}`;
  saveCart();
}

function openCart() {
  cartPanel.classList.add("open");
  cartScrim.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartPanel.classList.remove("open");
  cartScrim.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
}

cartLink.addEventListener("click", (e) => { e.preventDefault(); openCart(); });
cartClose.addEventListener("click", closeCart);
cartScrim.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

// ────────── add-to-bag ──────────
const toast = document.getElementById("toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

document.querySelectorAll(".add").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    cart.push({ name: btn.dataset.name, price: parseInt(btn.dataset.price, 10) });
    renderCart();
    btn.classList.add("added");
    const original = btn.textContent;
    btn.textContent = "added";
    showToast("added to bag");
    setTimeout(() => {
      btn.classList.remove("added");
      btn.textContent = original;
    }, 1400);
  });
});

renderCart();

// ────────── pause marquees on hover (just the band ones) ──────────
document.querySelectorAll(".band").forEach((band) => {
  const track = band.querySelector(".marquee-track");
  if (!track) return;
  band.addEventListener("mouseenter", () => track.style.animationPlayState = "paused");
  band.addEventListener("mouseleave", () => track.style.animationPlayState = "running");
});
