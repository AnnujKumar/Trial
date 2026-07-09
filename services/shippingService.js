import { clamp, roundCurrency, sum } from '../mathUtilities.js';

const shippingProfiles = {
    standard: {
        id: 'standard',
        label: 'Standard',
        description: 'Reliable ground shipping',
        baseCost: 6.95,
        weightFactor: 0.65,
        deliveryDays: [4, 6]
    },
    express: {
        id: 'express',
        label: 'Express',
        description: 'Faster delivery window',
        baseCost: 14.95,
        weightFactor: 0.85,
        deliveryDays: [2, 3]
    },
    overnight: {
        id: 'overnight',
        label: 'Overnight',
        description: 'Next-business-day shipping',
        baseCost: 29.95,
        weightFactor: 1.15,
        deliveryDays: [1, 1]
    }
};

const getWeight = (cartItems = []) => sum(cartItems.map((item) => Number(item.weight || 0.5) * Number(item.quantity || 1)));

const formatEta = (deliveryDays = [4, 6]) => `${deliveryDays[0]}-${deliveryDays[1]} business days`;

export const calculateShippingCost = (shippingOptionId = 'standard', cartItems = []) => {
    const profile = shippingProfiles[shippingOptionId] ?? shippingProfiles.standard;
    const weight = getWeight(cartItems);
    const distanceFactor = clamp(weight, 0, 8) * profile.weightFactor;
    return roundCurrency(profile.baseCost + distanceFactor);
};

export const getShippingOptions = (cartItems = []) => {
    const subtotal = sum(cartItems.map((item) => item.price * item.quantity));

    return Object.values(shippingProfiles).map((profile) => ({
        id: profile.id,
        label: profile.label,
        description: profile.description,
        eta: formatEta(profile.deliveryDays),
        cost: subtotal >= 150 && profile.id === 'standard' ? 0 : calculateShippingCost(profile.id, cartItems)
    }));
};

export const getEstimatedDeliveryWindow = (shippingOptionId = 'standard') => {
    const profile = shippingProfiles[shippingOptionId] ?? shippingProfiles.standard;
    return formatEta(profile.deliveryDays);
};