import { clamp, formatMoney, roundCurrency, sum } from './mathUtilities.js';

export const validateCard = (cardNumber = '') => {
    const normalizedNumber = String(cardNumber).replace(/\s+/g, '');

    return {
        valid: /^\d{16}$/.test(normalizedNumber),
        normalizedNumber
    };
};

export const maskCardNumber = (cardNumber = '') => {
    const digits = String(cardNumber).replace(/\s+/g, '');
    return `•••• •••• •••• ${digits.slice(-4)}`;
};

export const processPayment = (amount, cardDetails = {}) => {
    const cardValidation = validateCard(cardDetails.number);

    if (!cardValidation.valid) {
        throw new Error('Invalid card details provided.');
    }

    const authorizedAmount = roundCurrency(amount);
    const processingFee = roundCurrency(Math.max(1.49, authorizedAmount * 0.029));
    const totalCaptured = sum([authorizedAmount, processingFee]);
    const fraudScore = clamp(100 - (authorizedAmount / 12), 12, 99);

    if (fraudScore < 20) {
        throw new Error('Payment flagged by fraud checks.');
    }

    return `${formatMoney(totalCaptured)} captured successfully.`;
};