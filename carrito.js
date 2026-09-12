/* =====================================================
   CONFIGURACIÓN
===================================================== */
const WHATSAPP_NUMBER = "573148013311"; // +57 314 801 3311 sin espacios ni símbolos

/* =====================================================
   CATÁLOGO DE PRODUCTOS
===================================================== */
const PRODUCTS = [
    // Herramientas Eléctricas
    { id: 1, name: "Taladro Percutor 1/2\" 650W", category: "Herramientas Eléctricas", price: 189000, unit: "unidad", icon: "🔩" },
    { id: 2, name: "Pulidora Angular 4 1/2\"", category: "Herramientas Eléctricas", price: 145000, unit: "unidad", icon: "⚙️" },
    { id: 3, name: "Sierra Circular 7 1/4\"", category: "Herramientas Eléctricas", price: 310000, unit: "unidad", icon: "🪚" },
    { id: 4, name: "Rotomartillo SDS Plus", category: "Herramientas Eléctricas", price: 420000, unit: "unidad", icon: "🛠️" },

    // Herramientas Manuales
    { id: 5, name: "Martillo de Uña 16 oz", category: "Herramientas Manuales", price: 32000, unit: "unidad", icon: "🔨" },
    { id: 6, name: "Set Destornilladores x6", category: "Herramientas Manuales", price: 28000, unit: "set", icon: "🪛" },
    { id: 7, name: "Llave Inglesa 10\"", category: "Herramientas Manuales", price: 41000, unit: "unidad", icon: "🔧" },
    { id: 8, name: "Alicate Universal 8\"", category: "Herramientas Manuales", price: 24000, unit: "unidad", icon: "🗜️" },
    { id: 9, name: "Flexómetro 5m", category: "Herramientas Manuales", price: 15000, unit: "unidad", icon: "📏" },

    // Materiales de Construcción
    { id: 10, name: "Cemento Gris 50kg", category: "Materiales de Construcción", price: 33000, unit: "bulto", icon: "🧱" },
    { id: 11, name: "Arena de Peña", category: "Materiales de Construcción", price: 55000, unit: "m³", icon: "⛰️" },
    { id: 12, name: "Ladrillo Común", category: "Materiales de Construcción", price: 950, unit: "unidad", icon: "🧱" },
    { id: 13, name: "Varilla Corrugada 1/2\" x 6m", category: "Materiales de Construcción", price: 38000, unit: "unidad", icon: "🔗" },

    // Pintura
    { id: 14, name: "Pintura Vinilo Blanco 5 Gal", category: "Pintura", price: 175000, unit: "galón", icon: "🎨" },
    { id: 15, name: "Esmalte Sintético 1/4 Gal", category: "Pintura", price: 29000, unit: "galón", icon: "🖌️" },
    { id: 16, name: "Brocha 3\"", category: "Pintura", price: 12000, unit: "unidad", icon: "🖌️" },
    { id: 17, name: "Rodillo de Espuma 9\"", category: "Pintura", price: 14000, unit: "unidad", icon: "🎨" },

    // Plomería
    { id: 18, name: "Tubo PVC 1/2\" x 3m", category: "Plomería", price: 9500, unit: "unidad", icon: "🚰" },
    { id: 19, name: "Llave de Paso 1/2\"", category: "Plomería", price: 18000, unit: "unidad", icon: "🔧" },
    { id: 20, name: "Codo PVC 90° 1/2\"", category: "Plomería", price: 1200, unit: "unidad", icon: "🔩" },
    { id: 21, name: "Cinta Teflón", category: "Plomería", price: 2500, unit: "unidad", icon: "🎗️" },

    // Electricidad
    { id: 22, name: "Cable THHN #12 (metro)", category: "Electricidad", price: 2800, unit: "metro", icon: "🔌" },
    { id: 23, name: "Bombillo LED 9W", category: "Electricidad", price: 8500, unit: "unidad", icon: "💡" },
    { id: 24, name: "Breaker 20A", category: "Electricidad", price: 22000, unit: "unidad", icon: "⚡" },
    { id: 25, name: "Toma Corriente Doble", category: "Electricidad", price: 9000, unit: "unidad", icon: "🔌" },

    // Seguridad Industrial
    { id: 26, name: "Casco de Seguridad", category: "Seguridad Industrial", price: 26000, unit: "unidad", icon: "⛑️" },
    { id: 27, name: "Guantes de Carnaza", category: "Seguridad Industrial", price: 13000, unit: "par", icon: "🧤" },
    { id: 28, name: "Gafas de Protección", category: "Seguridad Industrial", price: 9500, unit: "unidad", icon: "🥽" },
    { id: 29, name: "Botas Punta de Acero", category: "Seguridad Industrial", price: 98000, unit: "par", icon: "🥾" },
];

const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];

/* =====================================================
   ESTADO DEL CARRITO (persistente en localStorage)
===================================================== */
let cart = JSON.parse(localStorage.getItem("nvf_cart") || "{}");
let activeCategory = "Todos";

function saveCart() {
    localStorage.setItem("nvf_cart", JSON.stringify(cart));
    updateCartUI();
}

function formatCOP(value) {
    return "$" + value.toLocaleString("es-CO");
}

/* =====================================================
   NAVEGACIÓN ENTRE VISTAS
===================================================== */
const navLinks = document.querySelectorAll(".nav-link");
const views = document.querySelectorAll(".view");

function goToView(target) {
    views.forEach(v => v.classList.toggle("active", v.id === target));
    navLinks.forEach(l => l.classList.toggle("active", l.dataset.target === target));
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-target]").forEach(el => {
    el.addEventListener("click", () => goToView(el.dataset.target));
});

document.getElementById("burgerBtn").addEventListener("click", () => {
    document.getElementById("mainNav").classList.toggle("show-mobile");
});

/* =====================================================
   RENDER: CATEGORÍAS
===================================================== */
const categoryBar = document.getElementById("categoryBar");

function renderCategories() {
    const all = ["Todos", ...CATEGORIES];
    categoryBar.innerHTML = all.map(cat => {
        const count = cat === "Todos" ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat).length;
        return `<button class="chip ${cat === activeCategory ? "active" : ""}" data-cat="${cat}">
      ${cat} <span class="count">(${count})</span>
    </button>`;
    }).join("");

    categoryBar.querySelectorAll(".chip").forEach(chip => {
        chip.addEventListener("click", () => {
            activeCategory = chip.dataset.cat;
            renderCategories();
            renderProducts();
        });
    });
}

/* =====================================================
   RENDER: PRODUCTOS
===================================================== */
const productGrid = document.getElementById("productGrid");

function renderProducts() {
    const list = activeCategory === "Todos"
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === activeCategory);

    productGrid.innerHTML = list.map(p => {
        const qty = cart[p.id]?.qty || 0;
        return `
    <div class="product-card">
      <div class="product-media">
        <span class="product-tag">${p.category}</span>
        ${p.icon}
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-unit">Por ${p.unit}</div>
        <div class="product-price">${formatCOP(p.price)}</div>
        <div class="product-actions">
          <div class="qty-control">
            <button data-decr="${p.id}">−</button>
            <span id="qty-${p.id}">${qty}</span>
            <button data-incr="${p.id}">+</button>
          </div>
          <button class="add-btn" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    </div>`;
    }).join("");

    // Selector de cantidad (previo a agregar)
    productGrid.querySelectorAll("[data-incr]").forEach(btn => {
        btn.addEventListener("click", () => stepPendingQty(btn.dataset.incr, 1));
    });
    productGrid.querySelectorAll("[data-decr]").forEach(btn => {
        btn.addEventListener("click", () => stepPendingQty(btn.dataset.decr, -1));
    });
    productGrid.querySelectorAll("[data-add]").forEach(btn => {
        btn.addEventListener("click", () => addSelectedToCart(btn.dataset.add));
    });
}

// Cantidad "pendiente" seleccionada en la tarjeta antes de agregar al carrito
const pendingQty = {};

function stepPendingQty(id, delta) {
    const current = pendingQty[id] ?? 0;
    pendingQty[id] = Math.max(0, current + delta);
    document.getElementById(`qty-${id}`).textContent = pendingQty[id];
}

function addSelectedToCart(id) {
    const qtyToAdd = pendingQty[id] && pendingQty[id] > 0 ? pendingQty[id] : 1;
    const product = PRODUCTS.find(p => p.id == id);
    if (!product) return;

    if (cart[id]) {
        cart[id].qty += qtyToAdd;
    } else {
        cart[id] = { qty: qtyToAdd };
    }

    pendingQty[id] = 0;
    document.getElementById(`qty-${id}`).textContent = 0;

    saveCart();
    showToast(`${product.name} agregado al carrito`);
}

/* =====================================================
   CARRITO: RENDER Y ACCIONES
===================================================== */
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartFooterEl = document.getElementById("cartFooter");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");

function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("show");
}
function closeCart() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("show");
}
document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

function cartEntries() {
    return Object.entries(cart)
        .map(([id, data]) => ({ product: PRODUCTS.find(p => p.id == id), qty: data.qty }))
        .filter(entry => entry.product && entry.qty > 0);
}

function updateCartUI() {
    const entries = cartEntries();
    const totalItems = entries.reduce((sum, e) => sum + e.qty, 0);
    const totalPrice = entries.reduce((sum, e) => sum + e.qty * e.product.price, 0);

    cartCountEl.textContent = totalItems;
    cartTotalEl.textContent = formatCOP(totalPrice);

    if (entries.length === 0) {
        cartItemsEl.innerHTML = "";
        cartEmptyEl.classList.add("show");
        cartFooterEl.style.display = "none";
    } else {
        cartEmptyEl.classList.remove("show");
        cartFooterEl.style.display = "block";
        cartItemsEl.innerHTML = entries.map(e => `
      <div class="cart-item">
        <div class="cart-item-icon">${e.product.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${e.product.name}</div>
          <div class="cart-item-price">${formatCOP(e.product.price)} c/u</div>
          <div class="cart-item-row">
            <div class="qty-control">
              <button data-cart-decr="${e.product.id}">−</button>
              <span>${e.qty}</span>
              <button data-cart-incr="${e.product.id}">+</button>
            </div>
            <button class="cart-item-remove" data-cart-remove="${e.product.id}">Eliminar</button>
          </div>
        </div>
      </div>
    `).join("");

        cartItemsEl.querySelectorAll("[data-cart-incr]").forEach(btn => {
            btn.addEventListener("click", () => {
                cart[btn.dataset.cartIncr].qty += 1;
                saveCart();
            });
        });
        cartItemsEl.querySelectorAll("[data-cart-decr]").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.cartDecr;
                cart[id].qty -= 1;
                if (cart[id].qty <= 0) delete cart[id];
                saveCart();
            });
        });
        cartItemsEl.querySelectorAll("[data-cart-remove]").forEach(btn => {
            btn.addEventListener("click", () => {
                delete cart[btn.dataset.cartRemove];
                saveCart();
            });
        });
    }

    // refrescar cantidades pendientes visibles en el catálogo (por si el carrito cambió)
    renderProducts();
}

document.getElementById("clearCartBtn").addEventListener("click", () => {
    if (Object.keys(cart).length === 0) return;
    cart = {};
    saveCart();
    showToast("Carrito vaciado");
});

/* =====================================================
   CHECKOUT POR WHATSAPP
===================================================== */
document.getElementById("checkoutBtn").addEventListener("click", () => {
    const entries = cartEntries();
    if (entries.length === 0) {
        showToast("Tu carrito está vacío");
        return;
    }

    const totalPrice = entries.reduce((sum, e) => sum + e.qty * e.product.price, 0);

    let message = "¡Hola! Quiero hacer el siguiente pedido en *Nueva Vitrina Ferretera*:\n\n";
    entries.forEach(e => {
        message += `• ${e.qty} x ${e.product.name} — ${formatCOP(e.product.price)} c/u = ${formatCOP(e.qty * e.product.price)}\n`;
    });
    message += `\n*Total: ${formatCOP(totalPrice)}*\n\nQuedo atento/a para coordinar el pago y la entrega. ¡Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
});

/* =====================================================
   TOAST
===================================================== */
let toastTimer = null;
function showToast(text) {
    const toast = document.getElementById("toast");
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* =====================================================
   INICIALIZAR
===================================================== */
renderCategories();
renderProducts();
updateCartUI();