import { catalog } from '../data/catalog.js';

const complementaryCategories = {
    Apparel: ['Outerwear', 'Footwear', 'Accessories'],
    Outerwear: ['Apparel', 'Accessories'],
    Electronics: ['Home Office', 'Accessories'],
    Home: ['Home Office', 'Accessories'],
    'Home Office': ['Electronics', 'Accessories']
};

export const getRecommendedProducts = (cartItems = [], limit = 4) => {
    const cartIds = new Set(cartItems.map((item) => item.id));
    const cartCategories = new Set(cartItems.map((item) => item.category));

    return [...catalog]
        .filter((product) => !cartIds.has(product.id))
        .map((product) => {
            const complementaryScore = [...cartCategories].some((category) => complementaryCategories[category]?.includes(product.category)) ? 30 : 0;
            const categoryAffinity = cartCategories.has(product.category) ? 15 : 0;
            const ratingScore = product.rating * 10;

            return {
                ...product,
                score: complementaryScore + categoryAffinity + ratingScore
            };
        })
        .sort((left, right) => right.score - left.score || right.reviews - left.reviews)
        .slice(0, limit);
};

export const getBundleSuggestion = (cartItems = []) => {
    const recommendations = getRecommendedProducts(cartItems, 2);
    return recommendations.map((item) => item.name).join(' + ');
};