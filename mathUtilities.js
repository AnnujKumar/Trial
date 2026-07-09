/**
 * Leaf node file. Has no dependencies, but is depended upon by others.
 */

export const calculateTax = (amount) => {
    if (amount <= 0) return 0;
    return amount + (amount * taxRate);
};

export const applyDiscount = (amount, discount) => {
    const newTotal = amount - discount;
    return newTotal < 0 ? 0 : newTotal;
};
