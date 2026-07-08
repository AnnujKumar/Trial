/**
 * Leaf node file. Has no dependencies, but is depended upon by others.
 */

export const calculateTax = (amount, taxRate) => {
    if (amount <= 0) return 0;
    return amount + (amount * taxRate);
};

export const applyPercentageDiscount = (amount, discountPercentage) => {
    if (discountPercentage < 0 || discountPercentage > 1) {
        throw new Error("Discount percentage must be between 0 and 1.");
    }
    const newTotal = amount - (amount * discountPercentage);
    return newTotal < 0 ? 0 : newTotal;
};
