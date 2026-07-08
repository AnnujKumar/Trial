import { calculateTax } from './mathUtils.js';

export const validateCard = (cardNumber) => {
    // Basic mock validation
    return cardNumber && cardNumber.length === 16;
};

export const processPayment = (amount, cardDetails) => {
    if (!validateCard(cardDetails.number)) {
        throw new Error("Invalid card details provided.");
    }
    
    // AST needs to catch this cross-file function call
    const finalCharge = calculateTax(amount, 0.08); 
    
    console.log(`Charging card ending in ${cardDetails.number.slice(-4)} for $${finalCharge}`);
    
    return { success: true, transactionId: "txn_898989" };
};