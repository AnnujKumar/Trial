import { getCatalog, getCategories, getCollections, getCatalogStats, getFeaturedProducts, searchCatalog } from './services/catalogService.js';
import { addToCart, clearCart, getCartCount, getCartSubtotal, loadCart, removeFromCart, saveCart, updateQuantity } from './services/cartService.js';
import { finalizeOrder, prepareCheckout } from './checkoutService.js';
import { getInventoryWarnings } from './services/inventoryService.js';
import { getRecommendedProducts } from './services/recommendationService.js';
import { formatMoney } from './mathUtilities.js';

const catalog = getCatalog();
const catalogById = new Map(catalog.map((product) => [product.id, product]));

const state = {
    cart: loadCart(),
    filters: {
        query: '',
        category: 'All',
        sortBy: 'featured',
        maxPrice: 250
    },
    checkout: {
        couponCode: 'SAVE10',
        shippingOption: 'standard'
    },
    customer: {
        name: 'Avery Stone',
        email: 'avery@example.com',
        address: '112 Harbor Lane, Portland, OR'
    },
    payment: {
        number: '4242424242424242',
        expiry: '12/28',
        cvc: '123',
        holder: 'Avery Stone'
    },
    order: null
};

const elements = {};

const queryElements = () => {
    elements.heroStats = document.querySelector('[data-hero-stats]');
    elements.categoryRail = document.querySelector('[data-category-rail]');
    elements.collectionStrip = document.querySelector('[data-collection-strip]');
    elements.catalogGrid = document.querySelector('[data-catalog-grid]');
    elements.searchInput = document.querySelector('[data-search-input]');
    elements.sortSelect = document.querySelector('[data-sort-select]');
    elements.priceRange = document.querySelector('[data-price-range]');
    elements.priceLabel = document.querySelector('[data-price-label]');
    elements.cartItems = document.querySelector('[data-cart-items]');
    elements.cartCount = document.querySelector('[data-cart-count]');
    elements.cartSubtotal = document.querySelector('[data-cart-subtotal]');
    elements.checkoutTotal = document.querySelector('[data-checkout-total]');
    elements.checkoutBreakdown = document.querySelector('[data-checkout-breakdown]');
    elements.checkoutWarnings = document.querySelector('[data-checkout-warnings]');
    elements.recommendations = document.querySelector('[data-recommendations]');
    elements.inventoryFeed = document.querySelector('[data-inventory-feed]');
    elements.receipt = document.querySelector('[data-receipt]');
    elements.couponInput = document.querySelector('[data-coupon-input]');
    elements.shippingSelect = document.querySelector('[data-shipping-select]');
    elements.checkoutForm = document.querySelector('[data-checkout-form]');
    elements.clearCartButton = document.querySelector('[data-clear-cart]');
};

const setCart = (nextCart) => {
    state.cart = nextCart;
    saveCart(state.cart);
    renderAll();
};

const createProductCard = (product) => {
    const card = document.createElement('article');
    card.className = 'product-card reveal';
    card.innerHTML = `
        <div class="product-card__badge">${product.badge}</div>
        <div class="product-card__meta">${product.category}</div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <ul class="feature-list">
            ${product.features.map((feature) => `<li>${feature}</li>`).join('')}
        </ul>
        <div class="product-card__footer">
            <div>
                <strong>${formatMoney(product.price)}</strong>
                <span>${product.rating.toFixed(1)} rating · ${product.reviews} reviews</span>
            </div>
            <button class="button button--primary" data-add-to-cart="${product.id}">Add</button>
        </div>
    `;

    return card;
};

const renderHeroStats = () => {
    const stats = getCatalogStats();
    elements.heroStats.innerHTML = `
        <div class="stat-card">
            <strong>${stats.productCount}</strong>
            <span>products in catalog</span>
        </div>
        <div class="stat-card">
            <strong>${stats.categoryCount}</strong>
            <span>cross-functional categories</span>
        </div>
        <div class="stat-card">
            <strong>${stats.averageRating.toFixed(1)}</strong>
            <span>average product rating</span>
        </div>
        <div class="stat-card">
            <strong>${stats.featuredCollectionCount}</strong>
            <span>curated collections</span>
        </div>
    `;
};

const renderCategories = () => {
    elements.categoryRail.innerHTML = getCategories().map((category) => `
        <button class="chip ${state.filters.category === category ? 'chip--active' : ''}" data-category="${category}">${category}</button>
    `).join('');
};

const renderCollections = () => {
    elements.collectionStrip.innerHTML = getCollections().map((collection) => `
        <article class="collection-card">
            <h3>${collection.name}</h3>
            <p>${collection.description}</p>
        </article>
    `).join('');
};

const renderCatalog = () => {
    const products = searchCatalog({
        query: state.filters.query,
        category: state.filters.category,
        maxPrice: state.filters.maxPrice,
        sortBy: state.filters.sortBy
    });

    elements.catalogGrid.innerHTML = '';
    if (!products.length) {
        elements.catalogGrid.innerHTML = '<div class="empty-state">No products match the current filters.</div>';
        return;
    }

    products.forEach((product) => elements.catalogGrid.appendChild(createProductCard(product)));
};

const renderCart = () => {
    elements.cartCount.textContent = String(getCartCount(state.cart));
    elements.cartSubtotal.textContent = formatMoney(getCartSubtotal(state.cart));

    if (!state.cart.length) {
        elements.cartItems.innerHTML = '<div class="empty-state">Your cart is empty. Add something from the catalog.</div>';
        return;
    }

    elements.cartItems.innerHTML = state.cart.map((item) => `
        <article class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <span>${item.category} · ${formatMoney(item.price)} each</span>
            </div>
            <div class="cart-item__actions">
                <button data-qty="decrease" data-id="${item.id}">−</button>
                <span>${item.quantity}</span>
                <button data-qty="increase" data-id="${item.id}">+</button>
                <button class="text-button" data-remove="${item.id}">Remove</button>
            </div>
        </article>
    `).join('');
};

const renderInventory = () => {
    const warnings = getInventoryWarnings(state.cart);
    elements.inventoryFeed.innerHTML = warnings.length
        ? warnings.map((warning) => `<div class="notice">${warning.message}</div>`).join('')
        : '<div class="notice notice--success">Inventory is healthy for the current cart.</div>';
};

const renderCheckout = () => {
    const checkoutState = prepareCheckout(state.cart, state.checkout);
    elements.checkoutTotal.textContent = formatMoney(checkoutState.pricing.total);
    elements.checkoutBreakdown.innerHTML = checkoutState.pricing.lines.map((line) => `
        <div class="summary-line">
            <span>${line.label}</span>
            <strong>${formatMoney(line.value)}</strong>
        </div>
    `).join('');

    elements.checkoutWarnings.innerHTML = checkoutState.inventoryWarnings.length
        ? checkoutState.inventoryWarnings.map((warning) => `<div class="notice">${warning.message}</div>`).join('')
        : '<div class="notice notice--success">Ready to ship.</div>';

    elements.recommendations.innerHTML = getRecommendedProducts(state.cart).map((product) => `
        <article class="recommendation-card">
            <strong>${product.name}</strong>
            <span>${product.category} · ${formatMoney(product.price)}</span>
        </article>
    `).join('');

    elements.receipt.innerHTML = state.order
        ? `
            <div class="receipt-card receipt-card--success">
                <strong>Order ${state.order.orderId}</strong>
                <p>${state.order.paymentResult.summary}</p>
                <span>Shipped via ${state.order.shipping.label}</span>
            </div>
        `
        : '<div class="receipt-card">Submit the checkout form to generate an order receipt.</div>';
};

const syncInputs = () => {
    elements.searchInput.value = state.filters.query;
    elements.sortSelect.value = state.filters.sortBy;
    elements.priceRange.value = String(state.filters.maxPrice);
    elements.priceLabel.textContent = formatMoney(state.filters.maxPrice);
    elements.couponInput.value = state.checkout.couponCode;
    elements.shippingSelect.value = state.checkout.shippingOption;
};

const renderFeatured = () => {
    const featured = getFeaturedProducts();
    const spotlight = document.querySelector('[data-featured-strip]');
    if (!spotlight) {
        return;
    }

    spotlight.innerHTML = featured.map((product) => `
        <article class="featured-card">
            <span>${product.badge}</span>
            <strong>${product.name}</strong>
            <p>${product.tagLine}</p>
        </article>
    `).join('');
};

const renderAll = () => {
    renderHeroStats();
    renderCategories();
    renderCollections();
    renderFeatured();
    renderCatalog();
    renderCart();
    renderInventory();
    renderCheckout();
    syncInputs();
};

const handleCatalogClick = (event) => {
    const addTarget = event.target.closest('[data-add-to-cart]');
    if (addTarget) {
        const product = catalogById.get(addTarget.dataset.addToCart);
        if (product) {
            setCart(addToCart(state.cart, product, 1));
        }
        return;
    }

    const categoryTarget = event.target.closest('[data-category]');
    if (categoryTarget) {
        state.filters.category = categoryTarget.dataset.category;
        renderAll();
    }
};

const handleCartClick = (event) => {
    const quantityButton = event.target.closest('[data-qty]');
    if (quantityButton) {
        const cartItem = state.cart.find((item) => item.id === quantityButton.dataset.id);
        const nextQuantity = quantityButton.dataset.qty === 'increase' ? cartItem.quantity + 1 : cartItem.quantity - 1;
        setCart(updateQuantity(state.cart, quantityButton.dataset.id, nextQuantity));
        return;
    }

    const removeButton = event.target.closest('[data-remove]');
    if (removeButton) {
        setCart(removeFromCart(state.cart, removeButton.dataset.remove));
    }
};

const handleCheckoutSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    state.customer = {
        name: String(formData.get('name') ?? state.customer.name),
        email: String(formData.get('email') ?? state.customer.email),
        address: String(formData.get('address') ?? state.customer.address)
    };
    state.payment = {
        number: String(formData.get('cardNumber') ?? state.payment.number),
        expiry: String(formData.get('cardExpiry') ?? state.payment.expiry),
        cvc: String(formData.get('cardCvc') ?? state.payment.cvc),
        holder: String(formData.get('cardHolder') ?? state.payment.holder)
    };
    state.checkout = {
        couponCode: String(formData.get('couponCode') ?? state.checkout.couponCode).trim().toUpperCase(),
        shippingOption: String(formData.get('shippingOption') ?? state.checkout.shippingOption)
    };

    try {
        state.order = finalizeOrder({
            cartItems: state.cart,
            couponCode: state.checkout.couponCode,
            shippingOption: state.checkout.shippingOption,
            customer: state.customer,
            cardDetails: state.payment,
            notes: String(formData.get('notes') ?? '')
        });
        setCart(clearCart());
        renderAll();
    } catch (error) {
        state.order = {
            orderId: 'CHECKOUT-ERROR',
            paymentResult: { summary: error.message },
            shipping: { label: 'Unavailable' }
        };
        renderAll();
    }
};

const attachListeners = () => {
    document.querySelector('[data-catalog-actions]')?.addEventListener('click', handleCatalogClick);
    document.querySelector('[data-cart-items]')?.addEventListener('click', handleCartClick);

    elements.searchInput.addEventListener('input', (event) => {
        state.filters.query = event.target.value;
        renderCatalog();
    });

    elements.sortSelect.addEventListener('change', (event) => {
        state.filters.sortBy = event.target.value;
        renderCatalog();
    });

    elements.priceRange.addEventListener('input', (event) => {
        state.filters.maxPrice = Number(event.target.value);
        elements.priceLabel.textContent = formatMoney(state.filters.maxPrice);
        renderCatalog();
    });

    elements.couponInput.addEventListener('change', (event) => {
        state.checkout.couponCode = String(event.target.value).trim().toUpperCase();
        renderCheckout();
    });

    elements.shippingSelect.addEventListener('change', (event) => {
        state.checkout.shippingOption = event.target.value;
        renderCheckout();
    });

    elements.clearCartButton.addEventListener('click', () => {
        state.order = null;
        setCart(clearCart());
    });

    elements.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
};

const initialize = () => {
    queryElements();
    attachListeners();
    renderAll();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}