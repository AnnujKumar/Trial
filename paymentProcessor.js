import { clamp, formatMoney, roundCurrency, sum } from './mathUtilities.js';

export const validateCard = (cardDetails = {}) => {
    const cardNumber = String(cardDetails.number ?? '').replace(/\s+/g, '');
    const expiry = String(cardDetails.expiry ?? '');
    const cvc = String(cardDetails.cvc ?? '');

    return /^\d{16}$/.test(cardNumber) && /^\d{2}\/\d{2}$/.test(expiry) && /^\d{3,4}$/.test(cvc);
};

export const maskCardNumber = (cardNumber = '') => {
    const digits = String(cardNumber).replace(/\s+/g, '');
    return `•••• •••• •••• ${digits.slice(-4)}`;
};

export const processPayment = (amount, cardDetails = {}) => {
    if (!validateCard(cardDetails)) {
        throw new Error('Invalid card details provided.');
    }

    const authorizedAmount = roundCurrency(amount);
    const processingFee = roundCurrency(Math.max(1.49, authorizedAmount * 0.029));
    const totalCaptured = sum([authorizedAmount, processingFee]);
    const fraudScore = clamp(100 - (authorizedAmount / 12), 12, 99);

    if (fraudScore < 20) {
        throw new Error('Payment flagged by fraud checks.');
    }

    return {
        success: true,
        transactionId: `txn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
        authorizedAmount,
        processingFee,
        totalCaptured,
        last4: String(cardDetails.number).replace(/\s+/g, '').slice(-4),
        maskedCard: maskCardNumber(cardDetails.number),
        summary: `${formatMoney(totalCaptured)} captured successfully.`
    };
};