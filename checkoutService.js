import { processPayment } from './paymentProcessor.js';
import { applyDiscount } from './mathUtils.js';

export class CheckoutService {
    constructor(cartTotal) {
        this.cartTotal = cartTotal;
    }

    finalizeOrder(couponCode, cardDetails) {
        let currentTotal = this.cartTotal;
        
        if (couponCode === 'SAVE20') {
            // AST needs to catch this direct call to mathUtils
            currentTotal = applyDiscount(this.cartTotal, 20);
        }
        
        try {
            // AST needs to catch this call to paymentProcessor, 
            // which internally calls mathUtils.
            const paymentResult = processPayment(currentTotal, cardDetails);
            
            if (paymentResult.success) {
                return { status: "COMPLETED", id: paymentResult.transactionId };
            }
        } catch (error) {
            console.error("Checkout failed:", error.message);
            return { status: "FAILED", reason: error.message };
        }
    }
}