import { catalog, categories, collections } from '../data/catalog.js';
import { clamp, roundCurrency } from '../mathUtilities.js';

const normalize = (value) => String(value ?? '').trim().toLowerCase();

export const getCatalog = () => catalog.map((product) => ({ ...product, price: roundCurrency(product.price) }));

export const getCategories = () => categories;

export const getCollections = () => collections;

export const getProductById = (productId) => catalog.find((product) => product.id === productId);

export const getFeaturedProducts = () => {
    return [...catalog]
        .sort((left, right) => right.rating - left.rating || right.reviews - left.reviews)
        .slice(0, 4)
        .map((product) => ({ ...product, price: roundCurrency(product.price) }));
};

export const searchCatalog = ({ query = '', category = 'All', maxPrice = Infinity, sortBy = 'featured' } = {}) => {
    const normalizedQuery = normalize(query);
    const priceCeiling = Number.isFinite(maxPrice) ? clamp(Number(maxPrice), 0, Infinity) : Infinity;

    let results = catalog.filter((product) => {
        const matchesCategory = category === 'All' || product.category === category;
        const matchesPrice = product.price <= priceCeiling;
        const matchesQuery = !normalizedQuery || [product.name, product.description, product.tagLine, ...product.features]
            .some((field) => normalize(field).includes(normalizedQuery));

        return matchesCategory && matchesPrice && matchesQuery;
    });

    results = results.sort((left, right) => {
        switch (sortBy) {
            case 'price-asc':
                return left.price - right.price;
            case 'price-desc':
                return right.price - left.price;
            case 'rating':
                return right.rating - left.rating;
            default:
                return right.reviews - left.reviews || right.rating - left.rating;
        }
    });

    return results.map((product) => ({ ...product, price: roundCurrency(product.price) }));
};

export const getCatalogStats = () => ({
    productCount: catalog.length,
    categoryCount: categories.length - 1,
    averageRating: roundCurrency(catalog.reduce((total, product) => total + product.rating, 0) / catalog.length),
    featuredCollectionCount: collections.length
});