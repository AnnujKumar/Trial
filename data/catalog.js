export const catalog = [
    {
        id: 'aurora-jacket',
        name: 'Aurora Trail Jacket',
        category: 'Outerwear',
        price: 128,
        rating: 4.9,
        reviews: 184,
        stock: 23,
        badge: 'Best Seller',
        tagLine: 'Weatherproof commuter layer',
        color: 'Midnight Navy',
        weight: 1.15,
        description: 'A modular shell with sealed seams, hidden ventilation, and a packable hood.',
        features: ['Sealed seams', 'Packable hood', 'Vent zips']
    },
    {
        id: 'atlas-backpack',
        name: 'Atlas Carry Backpack',
        category: 'Accessories',
        price: 94,
        rating: 4.8,
        reviews: 211,
        stock: 16,
        badge: 'New',
        tagLine: 'Built for work and travel',
        color: 'Forest',
        weight: 0.95,
        description: 'Structured storage with a laptop sleeve, side bottle pocket, and hidden passport slot.',
        features: ['Laptop sleeve', 'Trolley pass-through', 'Rain cover']
    },
    {
        id: 'terra-runner',
        name: 'Terra Run Runner',
        category: 'Footwear',
        price: 116,
        rating: 4.7,
        reviews: 160,
        stock: 19,
        badge: 'Editor's Pick',
        tagLine: 'Cushioned all-day movement',
        color: 'Sandstone',
        weight: 0.72,
        description: 'Lightweight performance sneaker with responsive foam and durable tread.',
        features: ['Responsive foam', 'Wide toe box', 'Reflective accents']
    },
    {
        id: 'loom-shirt',
        name: 'Loom Everyday Shirt',
        category: 'Apparel',
        price: 62,
        rating: 4.6,
        reviews: 97,
        stock: 34,
        badge: 'Core',
        tagLine: 'Soft structure, easy fit',
        color: 'Oat',
        weight: 0.28,
        description: 'A relaxed shirt made from textured cotton with a premium drape.',
        features: ['Textured cotton', 'Relaxed fit', 'Wash-resistant finish']
    },
    {
        id: 'signal-headphones',
        name: 'Signal Wireless Headphones',
        category: 'Electronics',
        price: 189,
        rating: 4.9,
        reviews: 286,
        stock: 12,
        badge: 'Top Rated',
        tagLine: 'Adaptive noise control',
        color: 'Slate',
        weight: 0.44,
        description: 'Over-ear headphones with long battery life, spatial audio, and quick charge.',
        features: ['Noise control', '40-hour battery', 'Fast charge']
    },
    {
        id: 'cove-mug',
        name: 'Cove Ceramic Mug',
        category: 'Home',
        price: 28,
        rating: 4.8,
        reviews: 94,
        stock: 48,
        badge: 'Giftable',
        tagLine: 'Hand-finished daily ritual',
        color: 'Clay',
        weight: 0.55,
        description: 'A tactile mug with an ergonomic grip and matte glaze.',
        features: ['Matte glaze', 'Heat retention', 'Dishwasher safe']
    },
    {
        id: 'lumen-lamp',
        name: 'Lumen Desk Lamp',
        category: 'Home Office',
        price: 84,
        rating: 4.7,
        reviews: 122,
        stock: 14,
        badge: 'Workspace',
        tagLine: 'Focused light for long sessions',
        color: 'Bone',
        weight: 1.6,
        description: 'A dimmable task lamp with warm and cool temperature presets.',
        features: ['Touch dimmer', 'USB-C power', 'Color presets']
    },
    {
        id: 'harbor-sweater',
        name: 'Harbor Knit Sweater',
        category: 'Apparel',
        price: 88,
        rating: 4.5,
        reviews: 81,
        stock: 27,
        badge: 'Seasonal',
        tagLine: 'Layer-friendly softness',
        color: 'Cedar',
        weight: 0.5,
        description: 'Midweight knit with a clean silhouette for layered outfits.',
        features: ['Soft knit', 'Shape retention', 'Ribbed hem']
    }
];

export const collections = [
    {
        id: 'new-arrivals',
        name: 'New Arrivals',
        description: 'Fresh drops built around modular wardrobes and everyday utility.'
    },
    {
        id: 'workday-essentials',
        name: 'Workday Essentials',
        description: 'Focused products for commuting, hybrid work, and a tidy desk setup.'
    },
    {
        id: 'travel-kit',
        name: 'Travel Kit',
        description: 'Carry-on friendly layers, storage, and electronics for longer routes.'
    }
];

export const categories = ['All', ...new Set(catalog.map((product) => product.category))];