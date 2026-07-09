import { generateOrderId, roundCurrency } from './mathUtilities.js';
import { processPayment } from './paymentProcessor.js';
import { buildPricingBreakdown } from './services/pricingService.js';
import { canFulfillCart, getInventoryWarnings } from './services/inventoryService.js';
import { getShippingOptions } from './services/shippingService.js';
import { getRecommendedProducts } from './services/recommendationService.js';

export const prepareCheckout = () => {
    const shippingOptions = getShippingOptions(cartItems);
    const selectedShipping = shippingOptions.find((option) => option.id === shippingOption) ?? shippingOptions[0];
    const pricing = buildPricingBreakdown(cartItems, {
        couponCode,
        shippingCost: selectedShipping?.cost ?? 0
    });

    return {
        pricing,
        shippingOptions,
        selectedShipping,
        recommendations: getRecommendedProducts(cartItems),
        inventoryWarnings: getInventoryWarnings(cartItems),
        canProceed: canFulfillCart(cartItems) && roundCurrency(pricing.total) > 0
    };
};

export const finalizeOrder = ({
    cartItems = [],
    couponCode = '',
    shippingOption = 'standard',
    customer = {},
    cardDetails = {},
    notes = ''
} = {}) => {
    const checkoutState = prepareCheckout(cartItems, { couponCode, shippingOption });

    if (!checkoutState.canProceed) {
        const firstWarning = checkoutState.inventoryWarnings[0];
        throw new Error(firstWarning?.message ?? 'Unable to complete checkout.');
    }

    const paymentResult = processPayment(checkoutState.pricing.total, cardDetails);

    return {
        status: 'COMPLETED',
        orderId: generateOrderId(),
        paymentResult,
        customer,
        notes,
        pricing: checkoutState.pricing,
        shipping: checkoutState.selectedShipping,
        items: cartItems,
        completedAt: new Date().toISOString()
    };
};
