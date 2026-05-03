// ────────── product data ──────────
const PRODUCTS = {
  shirt: {
    name: "The Sleep Shirt",
    sub: "Long-sleeve · button front",
    price: 999,
    description:
      "Relaxed, oversized fit — made for the long evening at home. A camp-collar pajama shirt in soft, lightweight cotton that drapes over the body and softens with every wash.",
    details: [
      "Camp collar with full-front button-down placket",
      "Small white buttons throughout",
      "Single chest pocket",
      "Long sleeves with wide turn-back cuffs",
      "Soft, lightweight cotton fabric",
      "Vertical stripes aligned across placket and pocket",
      "Smooth drape, premium stitching details",
    ],
  },
  pant: {
    name: "The Sleep Pant",
    sub: "Wide leg · drawstring",
    price: 1499,
    description:
      "Relaxed, straight-leg lounge pant. Mid-high rise with a soft elastic waist and adjustable drawstring — full length, loose, and easy to live in.",
    details: [
      "Mid-high rise",
      "Elastic waistband with gathered fabric",
      "Adjustable drawstring tie",
      "Full length, loose comfortable fit",
      "Lightweight cotton with soft flowing drape",
      "Minimal seams, no pockets",
    ],
  },
  shorts: {
    name: "The Shorts",
    sub: "Mid-rise · drawstring",
    price: 699,
    description:
      "Relaxed lounge shorts with a slightly flared hem. Airy, loose, and finished cleanly — the kind you reach for in a hot kitchen at midnight.",
    details: [
      "Mid-thigh length",
      "Elastic waistband with drawstring tie",
      "Slightly flared hem",
      "Lightweight cotton fabric",
      "Soft gathered waist detail",
      "Clean finished hem",
    ],
  },
  camo: {
    name: "The Camo",
    sub: "Cropped · tie front",
    price: 599,
    description:
      "Fitted, cropped camisole with a soft square neckline and a delicate lace-up tie front. Lightweight cotton, subtle bust shaping — a quiet, feminine piece.",
    details: [
      "Fitted, cropped silhouette",
      "Soft square neckline",
      "Thin shoulder straps",
      "Front lace-up tie detail with small white buttons",
      "Subtle shaping at the bust",
      "Lightweight cotton, delicate construction",
    ],
  },
};

const COLORWAYS = {
  blue: {
    label: "the ubey collection",
    sku: "01",
    swatchA: "#94b5d4",
    swatchB: "#3d1f18",
    images: {
      shirt: "images/blue-pajama-top.png",
      pant: "images/blue-pajama-pant.png",
      shorts: "images/blue-shorts.png",
      camo: "images/blue-camo.png",
    },
    stripeClass: "stripe-blue",
  },
  yellow: {
    label: "the buttery collection",
    sku: "02",
    swatchA: "#e6e2a0",
    swatchB: "#3d1f18",
    images: {
      shirt: "images/yellow-pajama-top.png",
      pant: "images/yellow-pajama-pant.png",
      shorts: "images/yellow-shorts.png",
      camo: "images/yellow-camo.png",
    },
    stripeClass: "stripe-yellow",
  },
  pink: {
    label: "the redink collection",
    sku: "03",
    swatchA: "#efc4cb",
    swatchB: "#a02828",
    images: {
      shirt: "images/pink-pajama-top.png",
      pant: "images/pink-pajama-pant.png",
      shorts: "images/pink-shorts.png",
      camo: "images/pink-camo.png",
    },
    stripeClass: "stripe-pink",
  },
};

const COLORWAY_LABEL = {
  blue: "Ubey",
  yellow: "Buttery",
  pink: "Redink",
};

// ────────── parse URL ──────────
const params = new URLSearchParams(window.location.search);
let type = params.get("type") || "shirt";
let cw = params.get("cw") || "blue";
if (!PRODUCTS[type]) type = "shirt";
if (!COLORWAYS[cw]) cw = "blue";

// ────────── render ──────────
function render() {
  const product = PRODUCTS[type];
  const colorway = COLORWAYS[cw];

  document.title = `${product.name} — ${COLORWAY_LABEL[cw]} · striped`;

  const eyebrow = document.getElementById("pdp-eyebrow");
  eyebrow.textContent = `— ${colorway.label} —`;

  document.getElementById("pdp-title").textContent = product.name;
  document.getElementById("pdp-sub").textContent = product.sub;
  document.getElementById("pdp-price").textContent = `₹${product.price}`;
  document.getElementById("pdp-desc").textContent = product.description;

  // image
  const img = document.getElementById("pdp-img");
  const wrap = document.getElementById("pdp-img-wrap");
  wrap.className = `pdp-img ${colorway.stripeClass}`;
  img.classList.remove("loaded");
  img.src = colorway.images[type];
  img.alt = `${product.name} in ${COLORWAY_LABEL[cw]}`;

  // detail bullets
  const detailsList = document.getElementById("pdp-details");
  detailsList.innerHTML = product.details
    .map((d) => `<li>${d}</li>`)
    .join("");

  // add-to-bag
  const addBtn = document.getElementById("pdp-add");
  addBtn.dataset.name = `${product.name} — ${COLORWAY_LABEL[cw]}`;
  addBtn.dataset.price = product.price;

  // colorway swatches
  const cwWrap = document.getElementById("pdp-cw");
  cwWrap.innerHTML = Object.entries(COLORWAYS)
    .map(
      ([key, v]) => `
        <button
          class="cw-swatch ${key === cw ? "active" : ""}"
          data-cw="${key}"
          aria-label="${v.label}"
        >
          <span class="cw-half" style="background:${v.swatchA}"></span>
          <span class="cw-half" style="background:${v.swatchB}"></span>
        </button>
      `,
    )
    .join("");

  cwWrap.querySelectorAll(".cw-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      cw = btn.dataset.cw;
      const url = new URL(window.location.href);
      url.searchParams.set("cw", cw);
      window.history.replaceState({}, "", url);
      render();
    });
  });

  // related products
  const relatedGrid = document.getElementById("pdp-related-grid");
  const relatedTypes = Object.keys(PRODUCTS).filter((t) => t !== type);
  relatedGrid.innerHTML = relatedTypes
    .map((t) => {
      const p = PRODUCTS[t];
      return `
      <a class="pdp-related-card" href="product.html?type=${t}&cw=${cw}">
        <div class="pdp-related-img ${colorway.stripeClass}">
          <img src="${colorway.images[t]}" alt="" loading="lazy" onload="this.classList.add('loaded')" onerror="this.style.display='none'" />
        </div>
        <div class="pdp-related-meta">
          <h3>${p.name}</h3>
          <span class="pdp-related-price">₹${p.price}</span>
        </div>
      </a>
    `;
    })
    .join("");
}

// size selector toggling
document.querySelectorAll("#pdp-sizes button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll("#pdp-sizes button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

render();
