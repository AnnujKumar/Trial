const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

export const roundCurrency = (value) => {
    const numericValue = Number(value) || 0;
    return Math.round((numericValue + Number.EPSILON) * 100) / 100;
};

export const formatMoney = (value) => currencyFormatter.format(roundCurrency(value));

export const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export const sum = (values = []) => roundCurrency(values.reduce((total, value) => total + (Number(value) || 0), 0));

export const percentageOf = (amount, percent) => roundCurrency((Number(amount) * Number(percent)) / 100);

export const applyDiscount = (amount, discountPercent) => {
    const numericAmount = Number(amount) || 0;
    const discountValue = percentageOf(numericAmount, discountPercent);
    return roundCurrency(Math.max(0, numericAmount - discountValue));
};

export const calculateTax = (amount, taxRate) => {
    const numericAmount = Number(amount) || 0;
    if (numericAmount <= 0) {
        return 0;
    }

    return roundCurrency(numericAmount + (numericAmount * Number(taxRate)));
};

export const generateOrderId = (prefix = 'ORD') => {
    const timeStamp = Date.now().toString(36).toUpperCase();
    const randomSegment = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `${prefix}-${timeStamp}-${randomSegment}`;
};