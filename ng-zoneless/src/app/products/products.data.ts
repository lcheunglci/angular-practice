export type ProductLarge = {
    id: number;
    name: string;
    price: number;
    rating: number;
    description: string;
};

export type ProductSmall = {
    id: number;
    name: string;
    price: number;
};

export const PRODUCTS_LARGE: ProductLarge[] = Array.from({ length: 12 }, (_, i) => ({
    id: 1000 + i,
    name: ['Desk Chair','Standing Desk','Monitor Arm','LED Lamp','USB Hub','Laptop Stand','Keyboard','Mouse','Headset','Webcam','Dock','Desk Mat'][i % 12],
    price: Math.round((79 + Math.random() * 320) * 100) / 100,
    rating: 3 + Math.floor(Math.random() * 3),
    description: 'Ergonomic and durable. Ships in 2–3 days.',
}));

export const PRODUCTS_SMALL: ProductSmall[] = Array.from({ length: 6 }, (_, i) => ({
    id: 1000 + i,
    name: ['Desk Chair','Standing Desk','Monitor Arm','LED Lamp','USB Hub','Laptop Stand','Keyboard','Mouse','Headset','Webcam','Dock','Desk Mat'][i % 12],
    price: Math.round((79 + Math.random() * 320) * 100) / 100,
}));
