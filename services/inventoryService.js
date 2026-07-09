import { catalog } from '../data/catalog.js';

export const getInventoryWarnings = (cartItems = []) => {
    const warnings = [];

    for (const item of cartItems) {
        const liveProduct = catalog.find((product) => product.id === item.id);
        const stock = liveProduct?.stock ?? item.stock ?? 0;

        if (item.quantity > stock) {
            warnings.push({
                id: item.id,
                message: `Only ${stock} left in stock for ${item.name}.`
            });
        } else if (stock <= 5) {
            warnings.push({
                id: item.id,
                message: `${item.name} is running low. Only ${stock} remaining.`
            });
        }
    }

    return warnings;
};

export const canFulfillCart = (cartItems = []) => {
    for (const item of cartItems) {
        const liveProduct = catalog.find((product) => product.id === item.id);
        const stock = liveProduct?.stock ?? item.stock ?? 0;

        if (item.quantity > stock) {
            return false;
        }
    }

    return true;
};

export const getInventorySnapshot = () => catalog.map(({ id, name, stock }) => ({ id, name, stock }));