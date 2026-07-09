import { calculateTax, formatMoney, percentageOf, roundCurrency, sum } from '../mathUtilities.js';

const couponRules = {
    SAVE10: { type: 'percent', value: 10, label: '10% off your order' },
    SAVE20: { type: 'percent', value: 20, label: '20% off orders over $200', minimumSubtotal: 200 },
    LAUNCH15: { type: 'percent', value: 15, label: 'Launch special, 15% off', minimumSubtotal: 120 },
    FREESHIP: { type: 'shipping', value: 0, label: 'Free shipping unlocked' }
};

const getSubtotal = (cartItems = []) => sum(cartItems.map((item) => item.price * item.quantity));

export const getCouponRule = (couponCode = '') => couponRules[String(couponCode).trim().toUpperCase()] ?? null;

export const buildPricingBreakdown = (cartItems = [], { couponCode = '', shippingCost = 0, taxRate = 0.0825 } = {}) => {
    const subtotal = getSubtotal(cartItems);
    const couponRule = getCouponRule(couponCode);
    const normalizedShipping = roundCurrency(shippingCost);

    let discount = 0;
    let effectiveShipping = normalizedShipping;

    if (couponRule?.minimumSubtotal && subtotal < couponRule.minimumSubtotal) {
        discount = 0;
    } else if (couponRule?.type === 'percent') {
        discount = percentageOf(subtotal, couponRule.value);
    }

    if (couponRule?.type === 'shipping') {
        effectiveShipping = 0;
    }

    const discountedSubtotal = roundCurrency(Math.max(0, subtotal - discount));
    const taxedTotal = calculateTax(discountedSubtotal, taxRate);
    const taxAmount = roundCurrency(taxedTotal - discountedSubtotal);
    const total = roundCurrency(taxedTotal + effectiveShipping);

    return {
        subtotal,
        discount,
        shipping: effectiveShipping,
        tax: taxAmount,
        total,
        savings: discount + Math.max(0, normalizedShipping - effectiveShipping),
        couponLabel: couponRule?.label ?? null,
        summary: {
            subtotal: formatMoney(subtotal),
            discount: formatMoney(discount),
            shipping: formatMoney(effectiveShipping),
            tax: formatMoney(taxAmount),
            total: formatMoney(total)
        },
        lines: [
            { label: 'Subtotal', value: subtotal },
            { label: 'Discount', value: -discount },
            { label: 'Shipping', value: effectiveShipping },
            { label: 'Tax', value: taxAmount },
            { label: 'Total', value: total }
        ]
    };
};

export const describeCoupon = (couponCode = '') => {
    const rule = getCouponRule(couponCode);
    return rule ? `${couponCode.toUpperCase()} - ${rule.label}` : 'No coupon applied';
};