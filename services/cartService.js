import { roundCurrency, sum } from '../mathUtilities.js';

export const CART_STORAGE_KEY = 'sample-ecommerce-cart:v1';

const cloneItem = (item) => ({ ...item, quantity: Number(item.quantity) || 1 });

export const loadCart = () => {
    if (typeof localStorage === 'undefined') {
        return [];
    }

    try {
        const rawCart = localStorage.getItem(CART_STORAGE_KEY);
        const parsedCart = rawCart ? JSON.parse(rawCart) : [];
        return Array.isArray(parsedCart) ? parsedCart.map(cloneItem) : [];
    } catch {
        return [];
    }
};

export const saveCart = (cartItems = []) => {
    if (typeof localStorage === 'undefined') {
        return cartItems;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.map(cloneItem)));
    return cartItems;
};

export const addToCart = (cartItems = [], product, quantity = 1) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    const nextQuantity = Number(quantity) || 1;

    if (existingItem) {
        return cartItems.map((item) => (
            item.id === product.id
                ? { ...item, quantity: item.quantity + nextQuantity }
                : item
        ));
    }

    return [...cartItems, cloneItem({ ...product, quantity: nextQuantity })];
};

export const updateQuantity = (cartItems = [], productId, quantity) => {
    const nextQuantity = Math.max(0, Number(quantity) || 0);

    if (nextQuantity === 0) {
        return cartItems.filter((item) => item.id !== productId);
    }

    return cartItems.map((item) => (
        item.id === productId
            ? { ...item, quantity: nextQuantity }
            : item
    ));
};

export const removeFromCart = (cartItems = [], productId) => cartItems.filter((item) => item.id !== productId);

export const clearCart = () => [];

export const getCartCount = (cartItems = []) => cartItems.reduce((total, item) => total + item.quantity, 0);

export const getCartSubtotal = (cartItems = []) => roundCurrency(sum(cartItems.map((item) => item.price * item.quantity)));